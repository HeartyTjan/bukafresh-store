package com.dark_store.bukafresh_backend.dto.response;

import com.dark_store.bukafresh_backend.model.Address;
import com.dark_store.bukafresh_backend.model.Delivery;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    private String id;
    private String subscriptionId;
    private String orderId;
    private LocalDateTime scheduledDate;
    private LocalDateTime actualDeliveryDate;
    private String status;
    private Address deliveryAddress;
    private List<DeliveryItemResponse> items;
    private String trackingNumber;
    private String driverName;
    private String driverPhone;
    private String deliveryNotes;
    private String customerNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryItemResponse {
        private String productId;
        private String name;
        private int quantity;
        private String unit;
        private Double price;
    }
}