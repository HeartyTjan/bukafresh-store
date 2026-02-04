package com.dark_store.bukafresh_backend.service;

import com.dark_store.bukafresh_backend.dto.onePipe.request.SendInvoiceRequest;
import com.dark_store.bukafresh_backend.dto.onePipe.response.OnePipeResponse;
import com.dark_store.bukafresh_backend.dto.request.CreatePaymentMandateRequest;
import com.dark_store.bukafresh_backend.dto.request.CreateSubscriptionRequest;
import org.springframework.scheduling.annotation.Async;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.concurrent.CompletableFuture;

public interface OnePipeService {


    Mono<OnePipeResponse> sendInvoice(String userId, String paymentReference, BigDecimal amount, CreatePaymentMandateRequest request);

//    @Async
//    CompletableFuture<String> createMandate(String userId, String tier, BigDecimal amount);
//
//    @Async
//    CompletableFuture<String> createMandate(CreateSubscriptionRequest request);
//
//    @Async
//    CompletableFuture<Boolean> collect(String mandateId, BigDecimal amount);
//
//    @Async
//    CompletableFuture<String> createAddOnInvoice(String userId, BigDecimal amount, String description);
}
