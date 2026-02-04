package com.dark_store.bukafresh_backend.dto.onePipe.response;

import lombok.Data;

@Data
public class OnePipeWebhookPayload {

    private Details details;

    @Data
    public static class Details {
        private String status;
        private String provider;
        private String transaction_ref; // your payment reference
        private String customer_ref; // customer account number
        private String customer_firstname;
        private String customer_surname;
        private String transaction_desc;
        private String transaction_type; // e.g., collect
        private String amount; // could be string, convert to BigDecimal later
        private Meta meta;

        @Data
        public static class Meta {
            private String mandate_id;
            private String subscription_id;
            private String event_type; // e.g., debit
            private String account_no; // identify customer
            private String biller_code; // identify merchant
            private String fee;
            private String expiry_date;
        }
    }
}
