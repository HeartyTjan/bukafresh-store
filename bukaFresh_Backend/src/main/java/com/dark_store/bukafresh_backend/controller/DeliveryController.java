package com.dark_store.bukafresh_backend.controller;

import com.dark_store.bukafresh_backend.dto.response.ApiResponse;
import com.dark_store.bukafresh_backend.dto.response.DeliveryResponse;
import com.dark_store.bukafresh_backend.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@Slf4j
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getUserDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getUserDeliveries();
        return ResponseEntity.ok(ApiResponse.<List<DeliveryResponse>>builder()
                .success(true)
                .message("Deliveries retrieved successfully")
                .data(deliveries)
                .build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getUpcomingDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getUpcomingDeliveries();
        return ResponseEntity.ok(ApiResponse.<List<DeliveryResponse>>builder()
                .success(true)
                .message("Upcoming deliveries retrieved successfully")
                .data(deliveries)
                .build());
    }

    @GetMapping("/past")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getPastDeliveries() {
        List<DeliveryResponse> deliveries = deliveryService.getPastDeliveries();
        return ResponseEntity.ok(ApiResponse.<List<DeliveryResponse>>builder()
                .success(true)
                .message("Past deliveries retrieved successfully")
                .data(deliveries)
                .build());
    }

    @GetMapping("/{deliveryId}")
    public ResponseEntity<ApiResponse<DeliveryResponse>> getDeliveryById(@PathVariable String deliveryId) {
        DeliveryResponse delivery = deliveryService.getDeliveryById(deliveryId);
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery retrieved successfully")
                .data(delivery)
                .build());
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ApiResponse<DeliveryResponse>> getDeliveryByTrackingNumber(@PathVariable String trackingNumber) {
        DeliveryResponse delivery = deliveryService.getDeliveryByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery tracked successfully")
                .data(delivery)
                .build());
    }

    @PutMapping("/{deliveryId}/reschedule")
    public ResponseEntity<ApiResponse<DeliveryResponse>> rescheduleDelivery(
            @PathVariable String deliveryId,
            @RequestParam String newDateTime) {
        DeliveryResponse delivery = deliveryService.rescheduleDelivery(deliveryId, newDateTime);
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery rescheduled successfully")
                .data(delivery)
                .build());
    }

    @PutMapping("/{deliveryId}/cancel")
    public ResponseEntity<ApiResponse<DeliveryResponse>> cancelDelivery(
            @PathVariable String deliveryId,
            @RequestParam String reason) {
        DeliveryResponse delivery = deliveryService.cancelDelivery(deliveryId, reason);
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery cancelled successfully")
                .data(delivery)
                .build());
    }

    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<ApiResponse<DeliveryResponse>> updateDeliveryStatus(
            @PathVariable String deliveryId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        DeliveryResponse delivery = deliveryService.updateDeliveryStatus(deliveryId, status, notes);
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery status updated successfully")
                .data(delivery)
                .build());
    }
}