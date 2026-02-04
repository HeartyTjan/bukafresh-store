package com.dark_store.bukafresh_backend.controller;

import com.dark_store.bukafresh_backend.dto.onePipe.response.OnePipeWebhookPayload;
import com.dark_store.bukafresh_backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks/onepipe")
@RequiredArgsConstructor
@Slf4j
public class OnePipeWebhookController {

    private final PaymentService paymentService;

    @PostMapping("/payment")
    public ResponseEntity<Void> handleOnePipeWebhook(@RequestBody OnePipeWebhookPayload payload) {
        log.info("Received OnePipe webhook payload: {}", payload);

        if (payload == null || payload.getDetails() == null || payload.getDetails().getMeta() == null) {
            log.warn("Webhook payload missing required fields, ignoring");
            return ResponseEntity.badRequest().build();
        }

        String paymentReference = payload.getDetails().getTransaction_ref(); // your internal payment ref
        String status = payload.getDetails().getStatus();
        String responseSummary = String.format(
                "Amount: %s, Mandate: %s, Subscription: %s, Customer: %s",
                payload.getDetails().getAmount(),
                payload.getDetails().getMeta().getMandate_id(),
                payload.getDetails().getMeta().getSubscription_id(),
                payload.getDetails().getCustomer_ref()
        );

        paymentService.handleOnePipeCallback(paymentReference, status, responseSummary);

        return ResponseEntity.ok().build();
    }
}
