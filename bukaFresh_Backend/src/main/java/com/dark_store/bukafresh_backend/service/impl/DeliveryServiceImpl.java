package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.dto.response.DeliveryResponse;
import com.dark_store.bukafresh_backend.exception.BusinessException;
import com.dark_store.bukafresh_backend.exception.ResourceNotFoundException;
import com.dark_store.bukafresh_backend.model.*;
import com.dark_store.bukafresh_backend.repository.*;
import com.dark_store.bukafresh_backend.service.DeliveryService;
import com.dark_store.bukafresh_backend.service.SecurityAlertService;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AddressRepository addressRepository;
    private final SecurityAlertService securityAlertService;
    private final ProfileRepository profileRepository;


    @Override
    public Delivery createDeliveryFromPayment(String paymentId, String subscriptionId) {
        log.info("Creating delivery for payment: {} and subscription: {}", paymentId, subscriptionId);
        
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

        List<Address> userAddresses = addressRepository.findByUserId(payment.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        Profile userProfile = profileRepository.findByUserId(payment.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        Address deliveryAddress = userAddresses.stream()
                .filter(address -> Boolean.TRUE.equals(address.getIsDefault()))
                .findFirst()
                .orElse(userAddresses.get(0));

        if (deliveryAddress == null) {
            throw new BusinessException("No delivery address found for user");
        }
        
        List<Delivery.DeliveryItem> deliveryItems = generateDeliveryItems(subscription.getTier());
        
        LocalDateTime scheduledDate = calculateScheduledDeliveryDate(subscription);
        
        Delivery delivery = Delivery.builder()
                .userId(payment.getUserId())
                .subscriptionId(subscriptionId)
                .paymentId(paymentId)
                .scheduledDate(scheduledDate)
                .status("SCHEDULED")
                .deliveryAddress(deliveryAddress)
                .items(deliveryItems)
                .trackingNumber(generateTrackingNumber())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        delivery = deliveryRepository.save(delivery);
        log.info("Delivery created successfully with ID: {}", delivery.getId());

        securityAlertService.sendTrackingNumber(userProfile.getEmail(),delivery.getTrackingNumber());

        String message = String.format(
                "Hello %s, your BukaFresh order is on the way! 🚚 " +
                        "Track your delivery using this ID: %s. " +
                        "Log in to your account, go to 'Delivery', click 'Track Delivery', and enter your tracking ID. " +
                        "Thank you for choosing BukaFresh!",
                userProfile.getFirstName(),
                delivery.getTrackingNumber()
        );
        securityAlertService.sendSms(userProfile.getPhone(), message)
                .doOnError(e -> log.error("Failed to send SMS: {}", e.getMessage()))
                .subscribe();

        return delivery;
    }

    @Override
    public List<DeliveryResponse> getUserDeliveries() {
        String userId = CurrentUserUtil.getCurrentUserId();
        List<Delivery> deliveries = deliveryRepository.findByUserIdOrderByScheduledDateDesc(userId);
        return deliveries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeliveryResponse> getUpcomingDeliveries() {
        try {
            String userId = CurrentUserUtil.getCurrentUserId();
            log.info("Fetching upcoming deliveries for user: {}", userId);
            
            List<String> upcomingStatuses = Arrays.asList("SCHEDULED", "PREPARING", "OUT_FOR_DELIVERY");
            List<Delivery> deliveries = deliveryRepository.findByUserIdAndStatusIn(userId, upcomingStatuses);
            
            log.info("Found {} upcoming deliveries for user: {}", deliveries.size(), userId);
            
            return deliveries.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching upcoming deliveries", e);
            throw new BusinessException("Failed to fetch upcoming deliveries: " + e.getMessage());
        }
    }

    @Override
    public List<DeliveryResponse> getPastDeliveries() {
        try {
            String userId = CurrentUserUtil.getCurrentUserId();
            log.info("Fetching past deliveries for user: {}", userId);
            
            List<String> pastStatuses = Arrays.asList("DELIVERED", "CANCELLED", "FAILED");
            List<Delivery> deliveries = deliveryRepository.findByUserIdAndStatusIn(userId, pastStatuses);
            
            log.info("Found {} past deliveries for user: {}", deliveries.size(), userId);
            
            return deliveries.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching past deliveries", e);
            throw new BusinessException("Failed to fetch past deliveries: " + e.getMessage());
        }
    }

    @Override
    public DeliveryResponse getDeliveryById(String deliveryId) {
        String userId = CurrentUserUtil.getCurrentUserId();
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        
        if (!delivery.getUserId().equals(userId)) {
            throw new BusinessException("Delivery does not belong to current user");
        }
        
        return mapToResponse(delivery);
    }

    @Override
    public DeliveryResponse updateDeliveryStatus(String deliveryId, String status, String notes) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        
        delivery.setStatus(status);
        delivery.setDeliveryNotes(notes);
        delivery.setUpdatedAt(LocalDateTime.now());
        
        if ("DELIVERED".equals(status)) {
            delivery.setActualDeliveryDate(LocalDateTime.now());
        }
        
        // Extract driver info from notes if it's an assignment
        if ("OUT_FOR_DELIVERY".equals(status) && notes != null && notes.startsWith("Assigned to driver:")) {
            String[] parts = notes.split(":");
            if (parts.length > 1) {
                String driverInfo = parts[1].trim();
                String[] driverParts = driverInfo.split("\\(");
                if (driverParts.length >= 2) {
                    delivery.setDriverName(driverParts[0].trim());
                    delivery.setDriverPhone(driverParts[1].replace(")", "").trim());
                }
            }
        }
        
        delivery = deliveryRepository.save(delivery);
        log.info("Delivery {} status updated to: {}", deliveryId, status);
        
        return mapToResponse(delivery);
    }

    @Override
    public DeliveryResponse rescheduleDelivery(String deliveryId, String newDateTime) {
        String userId = CurrentUserUtil.getCurrentUserId();
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        
        if (!delivery.getUserId().equals(userId)) {
            throw new BusinessException("Delivery does not belong to current user");
        }
        
        if (!"SCHEDULED".equals(delivery.getStatus())) {
            throw new BusinessException("Can only reschedule deliveries that are in SCHEDULED status");
        }
        
        LocalDateTime newScheduledDate = LocalDateTime.parse(newDateTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        delivery.setScheduledDate(newScheduledDate);
        delivery.setUpdatedAt(LocalDateTime.now());
        
        delivery = deliveryRepository.save(delivery);
        log.info("Delivery {} rescheduled to: {}", deliveryId, newDateTime);
        
        return mapToResponse(delivery);
    }

    @Override
    public DeliveryResponse cancelDelivery(String deliveryId, String reason) {
        String userId = CurrentUserUtil.getCurrentUserId();
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        
        if (!delivery.getUserId().equals(userId)) {
            throw new BusinessException("Delivery does not belong to current user");
        }
        
        if (Arrays.asList("DELIVERED", "CANCELLED").contains(delivery.getStatus())) {
            throw new BusinessException("Cannot cancel delivery with status: " + delivery.getStatus());
        }
        
        delivery.setStatus("CANCELLED");
        delivery.setCustomerNotes(reason);
        delivery.setUpdatedAt(LocalDateTime.now());
        
        delivery = deliveryRepository.save(delivery);
        log.info("Delivery {} cancelled with reason: {}", deliveryId, reason);
        
        return mapToResponse(delivery);
    }

    @Override
    public DeliveryResponse getDeliveryByTrackingNumber(String trackingNumber) {
        Delivery delivery = deliveryRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with tracking number: " + trackingNumber));
        
        return mapToResponse(delivery);
    }

    private List<Delivery.DeliveryItem> generateDeliveryItems(String tier) {
        // Generate items based on subscription tier
        // This is a simplified version - in real implementation, you'd have a more sophisticated system
        return switch (tier.toUpperCase()) {
            case "ESSENTIALS" -> Arrays.asList(
                    Delivery.DeliveryItem.builder()
                            .productId("prod-rice")
                            .name("Premium Rice")
                            .quantity(2)
                            .unit("kg")
                            .price(5000.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-beans")
                            .name("Brown Beans")
                            .quantity(1)
                            .unit("kg")
                            .price(2500.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-tomatoes")
                            .name("Fresh Tomatoes")
                            .quantity(2)
                            .unit("kg")
                            .price(1600.0)
                            .build()
            );
            case "STANDARD" -> Arrays.asList(
                    Delivery.DeliveryItem.builder()
                            .productId("prod-chicken")
                            .name("Fresh Chicken")
                            .quantity(2)
                            .unit("kg")
                            .price(7000.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-rice")
                            .name("Premium Rice")
                            .quantity(3)
                            .unit("kg")
                            .price(7500.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-vegetables")
                            .name("Mixed Vegetables")
                            .quantity(1)
                            .unit("bundle")
                            .price(3000.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-fish")
                            .name("Fresh Fish")
                            .quantity(1)
                            .unit("kg")
                            .price(4500.0)
                            .build()
            );
            case "PREMIUM" -> Arrays.asList(
                    Delivery.DeliveryItem.builder()
                            .productId("prod-beef")
                            .name("Premium Beef")
                            .quantity(2)
                            .unit("kg")
                            .price(12000.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-chicken")
                            .name("Organic Chicken")
                            .quantity(2)
                            .unit("kg")
                            .price(8000.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-seafood")
                            .name("Fresh Seafood Mix")
                            .quantity(1)
                            .unit("kg")
                            .price(15000.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-premium-rice")
                            .name("Basmati Rice")
                            .quantity(5)
                            .unit("kg")
                            .price(12500.0)
                            .build(),
                    Delivery.DeliveryItem.builder()
                            .productId("prod-organic-vegetables")
                            .name("Organic Vegetable Bundle")
                            .quantity(2)
                            .unit("bundle")
                            .price(8000.0)
                            .build()
            );
            default -> throw new BusinessException("Invalid subscription tier: " + tier);
        };
    }

    private LocalDateTime calculateScheduledDeliveryDate(Subscription subscription) {

        return subscription.getNextDeliveryDate().atTime(10, 0); // 10 AM delivery
    }

    private String generateTrackingNumber() {
        return "BF" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        List<DeliveryResponse.DeliveryItemResponse> itemResponses = delivery.getItems().stream()
                .map(item -> DeliveryResponse.DeliveryItemResponse.builder()
                        .productId(item.getProductId())
                        .name(item.getName())
                        .quantity(item.getQuantity())
                        .unit(item.getUnit())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return DeliveryResponse.builder()
                .id(delivery.getId())
                .subscriptionId(delivery.getSubscriptionId())
                .orderId(delivery.getOrderId())
                .scheduledDate(delivery.getScheduledDate())
                .actualDeliveryDate(delivery.getActualDeliveryDate())
                .status(delivery.getStatus())
                .deliveryAddress(delivery.getDeliveryAddress())
                .items(itemResponses)
                .trackingNumber(delivery.getTrackingNumber())
                .driverName(delivery.getDriverName())
                .driverPhone(delivery.getDriverPhone())
                .deliveryNotes(delivery.getDeliveryNotes())
                .customerNotes(delivery.getCustomerNotes())
                .createdAt(delivery.getCreatedAt())
                .updatedAt(delivery.getUpdatedAt())
                .build();
    }
}