package com.dark_store.bukafresh_backend.service.clients;


import com.dark_store.bukafresh_backend.config.OnePipeProperties;
import com.dark_store.bukafresh_backend.dto.onePipe.request.SendInvoiceRequest;
import com.dark_store.bukafresh_backend.dto.onePipe.response.OnePipeResponse;
import com.dark_store.bukafresh_backend.util.MD5Hash;
import com.dark_store.bukafresh_backend.util.TripleDES;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OnePipeSendInvoiceClient {

    private final WebClient webClient;
    private final OnePipeProperties props;

    public Mono<OnePipeResponse> sendSubscriptionInvoice(
            String accountNumber,
            String bankCode,
            String firstName,
            String surname,
            String email,
            String phone,
            String paymentReference,
            BigDecimal amountKobo,
            String startDate,
            String endDate,
            String repeatFrequency
    ) {

        validateInputs(accountNumber, bankCode, phone, amountKobo);

        String requestRef = generateRef("REQ");

        SendInvoiceRequest payload = buildRequest(
                requestRef,
                paymentReference,
                accountNumber,
                bankCode,
                firstName,
                surname,
                email,
                phone,
                amountKobo,
                startDate,
                endDate,
                repeatFrequency
        );

        log.info("Payload to onepipec {}", payload.toString());

        return sendRequest(requestRef, payload);
    }


    private Mono<OnePipeResponse> sendRequest(String requestRef, SendInvoiceRequest payload
    ) {
        return webClient
                .post()
                .uri(props.getBaseUrl() + "/v2/transact")
                .header("Authorization", "Bearer " + props.getApiKey())
                .header("Signature", MD5Hash.generate(requestRef, props.getClientSecret()))
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(OnePipeResponse.class);
    }


    private SendInvoiceRequest buildRequest(
            String requestRef,
            String transactionRef,
            String accountNumber,
            String bankCode,
            String firstName,
            String surname,
            String email,
            String phone,
            BigDecimal amountKobo,
            String startDate,
            String endDate,
            String repeatFrequency
    ) {

        String encryptedAccount = TripleDES.encrypt(
                accountNumber,
                bankCode,
                props.getClientSecret()
        );

        return SendInvoiceRequest.builder()
                .request_ref(requestRef)
                .request_type("send invoice")
                .auth(
                        SendInvoiceRequest.Auth.builder()
                                .type("bank.account")
                                .secure(encryptedAccount)
                                .auth_provider("PaywithAccount")
                                .build()
                )
                .transaction(
                        SendInvoiceRequest.Transaction.builder()
                                .mock_mode(props.getMockMode())
                                .transaction_ref(transactionRef)
                                .transaction_desc("Setup a subscription")
                                .transaction_ref_parent(null)
                                .amount(amountKobo)
                                .customer(
                                        SendInvoiceRequest.Customer.builder()
                                                .customer_ref(phone)
                                                .firstname(firstName)
                                                .surname(surname)
                                                .email(email)
                                                .mobile_no(phone)
                                                .build()
                                )
                                .meta(
                                        SendInvoiceRequest.Meta.builder()
                                                .type("subscription")
                                                .repeat_frequency(repeatFrequency)
                                                .repeat_start_date(startDate)
                                                .repeat_end_date(endDate)
                                                .biller_code(props.getBillerCode())
                                                .build()
                                )
                                .details(new HashMap<>())
                                .build()
                )
                .build();
    }

    private void validateInputs(
            String accountNumber,
            String bankCode,
            String phone,
            BigDecimal amount
    ) {

        if (accountNumber == null || !accountNumber.matches("\\d{10}"))
            throw new IllegalArgumentException("Invalid account number");

        if (bankCode == null || !bankCode.matches("\\d{3}"))
            throw new IllegalArgumentException("Invalid bank code");

        if (phone == null || !phone.matches("^(\\+234|234|0)[789][01]\\d{8}$"))
            throw new IllegalArgumentException("Invalid phone number. Use format: +2348012345678");

        validateAmount(amount);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null)
            throw new IllegalArgumentException("Amount cannot be null");

        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Amount must be greater than zero");

        if (amount.compareTo(new BigDecimal("1000000000")) > 0)
            throw new IllegalArgumentException("Amount too large");
    }

    private String generateRef(String prefix) {
        return prefix + "_" + UUID.randomUUID();
    }
}

