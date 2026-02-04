package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.dto.request.CreatePaymentMandateRequest;
import com.dark_store.bukafresh_backend.dto.response.PaymentResponse;
import com.dark_store.bukafresh_backend.exception.BusinessException;
import com.dark_store.bukafresh_backend.exception.ResourceNotFoundException;
import com.dark_store.bukafresh_backend.model.Payment;
import com.dark_store.bukafresh_backend.model.Subscription;
import com.dark_store.bukafresh_backend.repository.PaymentRepository;
import com.dark_store.bukafresh_backend.repository.SubscriptionRepository;
import com.dark_store.bukafresh_backend.service.DeliveryService;
import com.dark_store.bukafresh_backend.service.OnePipeService;
import com.dark_store.bukafresh_backend.service.PaymentService;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final OnePipeService onePipeService;
    private final DeliveryService deliveryService;

//    private static final Set<String> TERMINAL_STATES = Set.of("PAID", "FAILED");

    private final MongoTemplate mongoTemplate;


    @Override
    public PaymentResponse processPayment(CreatePaymentMandateRequest request, String idempotencyKey) {

        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new BusinessException("Idempotency-Key header is required");
        }

        String userId = CurrentUserUtil.getCurrentUserId();


        Payment existingPayment =
                paymentRepository.findByIdempotencyKey(idempotencyKey).orElse(null);

        if (existingPayment != null) {
            log.info("Idempotent replay detected. key={}, paymentRef={}",
                    idempotencyKey, existingPayment.getPaymentReference());
            return mapToResponse(existingPayment);
        }

        Subscription subscription = subscriptionRepository.findById(request.getSubscriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

        if (!subscription.getUserId().equals(userId)) {
            log.info("sub user id {} vs user id {}",  subscription.getUserId(), userId);
            throw new BusinessException("Subscription does not belong to current user");
        }

        if (!"PENDING".equals(subscription.getStatus())) {
            throw new BusinessException("Subscription is not in pending state");
        }

        String paymentReference = generatePaymentReference();

        Payment payment = Payment.builder()
                .userId(userId)
                .subscriptionId(subscription.getId())
                .amount(getSubscriptionAmount(subscription.getTier(), subscription.getBillingCycle()))
                .currency("NGN")
                .status("PENDING")
                .paymentReference(paymentReference)
                .idempotencyKey(idempotencyKey)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        try {
            payment = paymentRepository.save(payment);
        } catch (DuplicateKeyException e) {
            log.info("Duplicate idempotency key detected during save. key={}", idempotencyKey);

            return mapToResponse(
                    paymentRepository.findByIdempotencyKey(idempotencyKey)
                            .orElseThrow(() -> new IllegalStateException(
                                    "Payment exists but cannot be found"))
            );
        }

        onePipeService.sendInvoice(userId, paymentReference, payment.getAmount(),request)
                .subscribe(
                        r -> log.info("OnePipe invoice request sent for payment={}", paymentReference),
                        e -> log.error("Failed to initiate OnePipe payment", e)
                );

        return mapToResponse(payment);
    }


    @Override
    public PaymentResponse getPaymentById(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        
        String userId = CurrentUserUtil.getCurrentUserId();
        if (!payment.getUserId().equals(userId)) {
            throw new BusinessException("Payment does not belong to current user");
        }
        
        return mapToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getUserPayments(String userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        return payments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getSubscriptionPayments(String subscriptionId) {
        List<Payment> payments = paymentRepository.findBySubscriptionId(subscriptionId);
        return payments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponse handleOnePipeCallback(String paymentReference,
                                                 String status,
                                                 String responseSummary) {

        boolean successful = "Successful".equalsIgnoreCase(status)
                || "SUCCESS".equalsIgnoreCase(status);

        String failureReason = successful
                ? null
                : "Payment failed via OnePipe: " + status;

        Payment updatedPayment = atomicUpdatePaymentStatus(
                paymentReference,
                successful,
                responseSummary,
                failureReason
        );

        if (updatedPayment == null) {
            log.info("Duplicate or late OnePipe callback ignored. ref={}", paymentReference);

            Payment existing = paymentRepository.findByPaymentReference(paymentReference)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Payment not found for reference: " + paymentReference
                    ));

            return mapToResponse(existing);
        }

        if (successful) {
            Subscription subscription = subscriptionRepository
                    .findById(updatedPayment.getSubscriptionId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Subscription not found for payment: " + paymentReference
                    ));

            if (!"ACTIVE".equals(subscription.getStatus())) {

                if ("WEEKLY".equalsIgnoreCase(subscription.getBillingCycle())) {
                    subscription.setMaxDeliveriesPerMonth(4);
                } else {
                    subscription.setMaxDeliveriesPerMonth(1);
                }

                subscription.setNextDeliveryDate(calculateFirstDeliveryDate(
                        subscription.getBillingCycle(),
                        subscription.getDeliveryDay()
                ));

                subscription.setStatus("ACTIVE");
                subscription.setUpdatedAt(LocalDateTime.now());
                subscriptionRepository.save(subscription);
                
                // Create delivery after successful payment
                try {
                    deliveryService.createDeliveryFromPayment(updatedPayment.getId(), subscription.getId());
                    log.info("Delivery created successfully for payment: {}", paymentReference);
                } catch (Exception e) {
                    log.error("Failed to create delivery for payment: {}", paymentReference, e);
                    // Don't fail the payment process if delivery creation fails
                }
            }
        }

        return mapToResponse(updatedPayment);
    }



    private BigDecimal getSubscriptionAmount(String tier, String frequency) {
        tier = tier.toUpperCase();
        frequency = frequency.toUpperCase();

        return switch (tier) {
            case "ESSENTIALS" -> "WEEKLY".equals(frequency)
                    ? new BigDecimal("80000")
                    : new BigDecimal("70000");
            case "STANDARD" -> "WEEKLY".equals(frequency)
                    ? new BigDecimal("140000")
                    : new BigDecimal("110000");
            case "PREMIUM" -> "WEEKLY".equals(frequency)
                    ? new BigDecimal("320000")
                    : new BigDecimal("250000");
            default -> throw new IllegalArgumentException("Invalid subscription tier: " + tier);
        };
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .subscriptionId(payment.getSubscriptionId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .paymentReference(payment.getPaymentReference())
                .bankName(payment.getBankName())
                .accountNumber(maskAccountNumber(payment.getAccountNumber()))
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .failureReason(payment.getFailureReason())
                .build();
    }

    private String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "****";
        }
        return "******" + accountNumber.substring(accountNumber.length() - 4);
    }
    private String generatePaymentReference() {
        return "PAY_" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 16)
                .toUpperCase();
    }

    private Payment atomicUpdatePaymentStatus(String paymentReference,
                                              boolean successful,
                                              String responseSummary,
                                              String failureReason) {

        Query query = Query.query(
                Criteria.where("paymentReference").is(paymentReference)
                        .and("status").is("PENDING")
        );

        Update update = new Update()
                .set("status", successful ? "PAID" : "FAILED")
                .set("onePipeResponse", responseSummary)
                .set("updatedAt", LocalDateTime.now());

        if (successful) {
            update.set("paidAt", LocalDateTime.now());
        } else {
            update.set("failureReason", failureReason);
        }

        return mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                Payment.class,
                "payments"
        );
    }

    private LocalDate calculateFirstDeliveryDate(String deliveryFrequency, String deliveryDay) {
        LocalDate today = LocalDate.now();
        DayOfWeek targetDay = DayOfWeek.valueOf(deliveryDay.toUpperCase());

        LocalDate nextDeliveryDay = today.with(TemporalAdjusters.nextOrSame(targetDay));

        if ("MONTHLY".equalsIgnoreCase(deliveryFrequency)) {

            if (nextDeliveryDay.getMonth() == today.getMonth()) {
                return nextDeliveryDay;
            } else {
                return today.with(TemporalAdjusters.firstDayOfNextMonth())
                        .with(TemporalAdjusters.nextOrSame(targetDay));
            }
        } else {
            return nextDeliveryDay;
        }
    }


}