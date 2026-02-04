package com.dark_store.bukafresh_backend.dto.onePipe.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendInvoiceRequest {

    @NotBlank
    private String request_ref;

    @NotBlank
    private String request_type;

    @Valid
    @NotNull
    private Auth auth;

    @Valid
    @NotNull
    private Transaction transaction;


    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Auth {

        @NotBlank
        private String type;

        @NotBlank
        private String secure;

        @NotBlank
        private String auth_provider;
    }


    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transaction {

        @NotBlank
        private String mock_mode;

        @NotBlank
        private String transaction_ref;

        @NotBlank
        private String transaction_desc;

        private String transaction_ref_parent;

        @NotNull
        @DecimalMin(value = "1", message = "Amount must be greater than zero")
        private BigDecimal amount;

        @Valid
        @NotNull
        private Customer customer;

        @Valid
        @NotNull
        private Meta meta;

        @Builder.Default
        private Map<String, Object> details = Map.of();
    }


    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Customer {

        @NotBlank
        private String customer_ref;

        @NotBlank
        private String firstname;

        @NotBlank
        private String surname;

        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String mobile_no;
    }


    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meta {

        @NotBlank
        private String type; // subscription

        @NotBlank
        private String repeat_frequency; // daily, weekly, monthly

        @Pattern(
                regexp = "\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}",
                message = "Invalid date format, expected yyyy-MM-dd-HH-mm-ss"
        )
        private String repeat_start_date;

        @Pattern(
                regexp = "\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}",
                message = "Invalid date format, expected yyyy-MM-dd-HH-mm-ss"
        )
        private String repeat_end_date;

        @NotBlank
        private String biller_code;
    }
}
