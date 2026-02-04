package com.dark_store.bukafresh_backend.controller;

import com.dark_store.bukafresh_backend.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
public class TestDeliveryController {

    @GetMapping("/delivery-system")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testDeliverySystem() {
        log.info("Testing delivery system endpoint");
        
        Map<String, Object> testData = new HashMap<>();
        testData.put("status", "Delivery system is running");
        testData.put("timestamp", LocalDateTime.now());
        testData.put("message", "Backend delivery endpoints are accessible");
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Delivery system test successful")
                .data(testData)
                .build());
    }

    @PostMapping("/create-sample-delivery")
    public ResponseEntity<ApiResponse<String>> createSampleDelivery() {
        log.info("Creating sample delivery for testing");
        
        try {
            // This is just for testing - in production, deliveries are created automatically
            // when payments are successful
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .success(true)
                    .message("Sample delivery creation endpoint available")
                    .data("Use the payment flow to create real deliveries")
                    .build());
        } catch (Exception e) {
            log.error("Error creating sample delivery", e);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .success(false)
                    .message("Error: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }

    @GetMapping("/auth-test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testAuthentication() {
        log.info("Testing authentication");
        
        Map<String, Object> authData = new HashMap<>();
        
        try {
            String userId = com.dark_store.bukafresh_backend.util.CurrentUserUtil.getCurrentUserId();
            authData.put("authenticated", true);
            authData.put("userId", userId);
            authData.put("message", "Authentication successful");
        } catch (Exception e) {
            authData.put("authenticated", false);
            authData.put("error", e.getMessage());
            authData.put("message", "Authentication failed");
        }
        
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Authentication test completed")
                .data(authData)
                .build());
    }
}