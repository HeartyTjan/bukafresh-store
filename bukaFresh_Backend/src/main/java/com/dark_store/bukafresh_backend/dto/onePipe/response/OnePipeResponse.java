package com.dark_store.bukafresh_backend.dto.onePipe.response;


import lombok.Data;

@Data
public class eOnePipeResponse {
    private String status;
    private String response_code;
    private String message;
    private Object data;
}
