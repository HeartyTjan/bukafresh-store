package com.dark_store.bukafresh_backend.service;


import com.dark_store.bukafresh_backend.model.User;
import org.springframework.scheduling.annotation.Async;
import reactor.core.publisher.Mono;

public interface SecurityAlertService {
    void sendNewDeviceLoginAlert(String email, String ip, String userAgent);

    @Async
    void SendEmailVerificationToNewUser(User savedUser, String token);

    Mono<Void> sendSms(String phone, String message);

    void sendTrackingNumber(String email, String trackingNumber);

//    Mono<Void> sendWhatsapp(String phone, String message);
}
