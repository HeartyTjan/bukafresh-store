package com.dark_store.bukafresh_backend.service;

import com.dark_store.bukafresh_backend.dto.request.CreatePaymentMandateRequest;
import com.dark_store.bukafresh_backend.dto.request.ProcessPaymentRequest;
import com.dark_store.bukafresh_backend.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse processPayment(CreatePaymentMandateRequest request, String idempotencyKey);

    PaymentResponse getPaymentById(String paymentId);
    List<PaymentResponse> getUserPayments(String userId);
    List<PaymentResponse> getSubscriptionPayments(String subscriptionId);
    PaymentResponse handleOnePipeCallback(String onePipeReference, String status, String response);
}