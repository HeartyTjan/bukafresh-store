package com.dark_store.bukafresh_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "deliveries")
public class Delivery {
    @Id
    private String id;
    
    private String userId;
    private String subscriptionId;
    private String orderId;
    private String paymentId;
    
    // Delivery scheduling
    private LocalDateTime scheduledDate;
    private LocalDateTime actualDeliveryDate;
    
    // Delivery status
    private String status; // SCHEDULED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, FAILED
    
    // Delivery address
    private Address deliveryAddress;
    
    // Items to be delivered
    private List<DeliveryItem> items;
    
    // Delivery tracking
    private String trackingNumber;
    private String driverName;
    private String driverPhone;
    private String deliveryNotes;
    private String customerNotes;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryItem {
        private String productId;
        private String name;
        private int quantity;
        private String unit;
        private Double price;
    }
}