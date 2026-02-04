package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.dto.onePipe.response.OnePipeResponse;
import com.dark_store.bukafresh_backend.dto.request.CreatePaymentMandateRequest;
import com.dark_store.bukafresh_backend.exception.ResourceNotFoundException;
import com.dark_store.bukafresh_backend.model.Profile;
import com.dark_store.bukafresh_backend.repository.ProfileRepository;
import com.dark_store.bukafresh_backend.service.OnePipeService;
import com.dark_store.bukafresh_backend.service.SecurityAlertService;
import com.dark_store.bukafresh_backend.service.clients.OnePipeSendInvoiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static com.dark_store.bukafresh_backend.util.DateFormater.ONEPIPE_DATE_FORMAT;


@Service
@RequiredArgsConstructor
@Slf4j
public class OnePipeServiceImpl implements OnePipeService {

    private final OnePipeSendInvoiceClient sendInvoiceClient;
    private final ProfileRepository profileRepository;
    private final SecurityAlertService securityAlertService;

    @Override
    public Mono<OnePipeResponse> sendInvoice(String userId, String paymentReference, BigDecimal amount, CreatePaymentMandateRequest request) {
        String accountNumber = request.getBankAccount().getAccountNumber();
        String bankCode = request.getBankAccount().getBankCode();
        BigDecimal amountInKobo = amount.multiply(new BigDecimal("100"));

        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusMonths(1);
        String repeatFrequency = "monthly";

        return Mono.fromCallable(() -> profileRepository.findByUserId(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Profile not found")))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(profile ->
                        sendInvoiceClient.sendSubscriptionInvoice(
                                        accountNumber,
                                        bankCode,
                                        profile.getFirstName(),
                                        profile.getLastName(),
                                        profile.getEmail(),
                                        profile.getPhone(),
                                        paymentReference,
                                        amountInKobo,
                                        startDate.format(ONEPIPE_DATE_FORMAT),
                                        endDate.format(ONEPIPE_DATE_FORMAT),
                                        repeatFrequency
                                )
                                .flatMap(response -> {
                                    log.info("profile phone number {}", profile.getPhone());
                                    if ("Successful".equalsIgnoreCase(response.getStatus()) && response.getData() != null) {
                                        String customerMessage = buildCustomerMessage(profile, response);

                                        Mono<Void> sms = securityAlertService.sendSms(profile.getPhone(), customerMessage);
                                        return Mono.when(sms)
                                                .thenReturn(response);
                                    } else {
                                        log.warn("OnePipe response not successful: {}", response.getMessage());
                                        return Mono.just(response);
                                    }
                                })
                )
                .doOnSubscribe(s -> log.info("Sending subscription invoice for user={}", userId))
                .doOnSuccess(r -> log.info("Subscription invoice sent successfully for paymentReference={}", paymentReference))
                .doOnError(e -> log.error("Subscription invoice failed for paymentReference={}", paymentReference, e));
    }

    private String buildCustomerMessage(Profile profile, OnePipeResponse response) {
        var provider = response.getData().getProvider_response();
        return String.format(
                "Hello %s %s! Your virtual account is ready:\n" +
                        "Account Number: %s\n" +
                        "Bank: %s\n" +
                        "Amount: %d\n" +
                        "Expiry Date: %s\n" +
                        "QR Code: %s",
                profile.getFirstName(),
                profile.getLastName(),
                provider.getAccount_number(),
                provider.getVirtual_account_bank_name(),
                provider.getTransaction_final_amount(),
                provider.getVirtual_account_expiry_date(),
                provider.getVirtual_account_qr_code_url()
        );
    }

//    @Async
//    @Override
//    public CompletableFuture<Boolean> collect(String mandateId, BigDecimal amount) {
//        // TODO: Call OnePipe collect API
//        System.out.println("Collecting payment for mandate: " + mandateId);
//        return CompletableFuture.completedFuture(true); // true if successful
//    }
//
//    @Async
//    @Override
//    public CompletableFuture<String> createAddOnInvoice(String userId, BigDecimal amount, String description) {
//        System.out.println("Creating add-on invoice for user: " + userId);
//        String invoiceId = "mock-invoice-id-" + userId;
//        return CompletableFuture.completedFuture(invoiceId);
//    }


}
