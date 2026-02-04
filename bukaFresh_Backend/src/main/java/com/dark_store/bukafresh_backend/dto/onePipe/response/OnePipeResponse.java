package com.dark_store.bukafresh_backend.dto.onePipe.response;


import lombok.Data;

@Data
public class OnePipeResponse {
    private String status;
    private String response_code;
    private String message;
    private OnePipeData data;

    @Data
    public static class OnePipeData {
        private ProviderResponse provider_response;

        @Data
        public static class ProviderResponse {
            private String reference;
            private String account_number;
            private String bank_code;
            private String virtual_account_name;
            private String virtual_account_bank_name;
            private String virtual_account_status;
            private Long transaction_final_amount;
            private String virtual_account_expiry_date;
            private String virtual_account_qr_code_url;
        }
    }
}
