package com.dark_store.bukafresh_backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentMandateRequest {

    @NotBlank(message = "Subscription Id is required")
    private String subscriptionId;

    @Valid
    @NotNull(message = "Bank account is required")
    private BankAccount bankAccount;

    @NotBlank(message = "BVN is required")
    @Pattern(
            regexp = "^\\d{11}$",
            message = "BVN must be exactly 11 digits"
    )
    private String bvn;
}