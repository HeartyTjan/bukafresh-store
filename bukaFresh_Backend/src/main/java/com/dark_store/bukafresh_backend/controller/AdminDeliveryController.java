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
@RequestMapping("/api/admin/deliveries")
@RequiredArgsConstructor
@Slf4j
public class AdminDeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getActiveDeliveries() {
        // This would typically require admin authentication
        // For now, we'll return all upcoming deliveries across all users
        // In a real system, you'd have a separate admin service method
        return ResponseEntity.ok(ApiResponse.<List<DeliveryResponse>>builder()
                .success(true)
                .message("Active deliveries retrieved successfully")
                .data(List.of()) // Placeholder - would implement admin-specific method
                .build());
    }

    @PutMapping("/{deliveryId}/assign-driver")
    public ResponseEntity<ApiResponse<DeliveryResponse>> assignDriver(
            @PathVariable String deliveryId,
            @RequestParam String driverName,
            @RequestParam String driverPhone) {
        
        // Update delivery with driver information and set status to OUT_FOR_DELIVERY
        DeliveryResponse delivery = deliveryService.updateDeliveryStatus(
                deliveryId, 
                "OUT_FOR_DELIVERY", 
                String.format("Assigned to driver: %s (%s)", driverName, driverPhone)
        );
        
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Driver assigned successfully")
                .data(delivery)
                .build());
    }

    @PutMapping("/{deliveryId}/mark-delivered")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markAsDelivered(
            @PathVariable String deliveryId,
            @RequestParam(required = false) String notes) {
        
        DeliveryResponse delivery = deliveryService.updateDeliveryStatus(
                deliveryId, 
                "DELIVERED", 
                notes != null ? notes : "Delivery completed successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery marked as delivered")
                .data(delivery)
                .build());
    }

    @PutMapping("/{deliveryId}/mark-failed")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markAsFailed(
            @PathVariable String deliveryId,
            @RequestParam String reason) {
        
        DeliveryResponse delivery = deliveryService.updateDeliveryStatus(
                deliveryId, 
                "FAILED", 
                "Delivery failed: " + reason
        );
        
        return ResponseEntity.ok(ApiResponse.<DeliveryResponse>builder()
                .success(true)
                .message("Delivery marked as failed")
                .data(delivery)
                .build());
    }
}