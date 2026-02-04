package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.model.User;
import com.dark_store.bukafresh_backend.service.SecurityAlertService;
import com.dark_store.bukafresh_backend.service.emailService.EmailDetails;
import com.dark_store.bukafresh_backend.service.emailService.IEmailService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityAlertServiceImpl implements SecurityAlertService {

    private final IEmailService emailService;

    @Value("${twilio.smsFrom}")
    private String smsFrom;

    @Value("${frontend.base.url}")
    private String frontendBaseUrl;
    @Async
    @Override
    public void sendNewDeviceLoginAlert(String email, String ip, String userAgent) {

        String html = """
                <p>Hello,</p>

                <p>A new login to your BukaFresh account just occurred.</p>

                <p><b>Details:</b></p>
                <ul>
                  <li><b>IP:</b> %s</li>
                  <li><b>Device:</b> %s</li>
                  <li><b>Time:</b> %s</li>
                </ul>

                <p>If this was <b>NOT</b> you, please update your password immediately
                and contact customer support.</p>

                <p>Kind regards,<br>
                BukaFresh Security Team</p>
                """.formatted(ip, userAgent, LocalDateTime.now());

        EmailDetails details = EmailDetails.builder()
                .recipient(email)
                .subject("Security Alert: New Login Detected")
                .messageBody(html)
                .isHtml(true)
                .build();

        emailService.sendEmailAlert(details);
    }

    @Async
    @Override
    public void SendEmailVerificationToNewUser(User savedUser, String token) {
        String userId = savedUser.getId();
        String verificationUrl = String.format("%s/verify-email?userId=%s&token=%s",frontendBaseUrl, userId, token);
        System.out.println("verification url: " + verificationUrl);

        String htmlBody = """
        <html>
        <body style="font-family:Arial, sans-serif; line-height:1.6;">
            <p>Hello,</p>

            <p>Welcome to BukaFresh 🎉</p>

            <p>To activate your account, please verify your email address:</p>

            <p>
                <a href="%s"
                   style="display:inline-block;
                          padding:5px 10px;
                          font-size:16px;
                          font-weight:600;
                          background-color:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:5px;">
                    Verify Email
                </a>
            </p>

            <p>This link expires in 30 minutes.</p>

            <p>If you didn't register this account, please ignore this email.</p>

            <br/>
            <p>Kind regards,<br/>BukaFresh Customer Success Team</p>
        </body>
        </html>
        """.formatted(verificationUrl);

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(savedUser.getEmail())
                .subject("Verify your BukaFresh Account")
                .messageBody(htmlBody)
                .isHtml(true)
                .build();

        emailService.sendEmailAlert(emailDetails);
    }

    @Override
    public Mono<Void> sendSms(String phone, String message) {
        return Mono.fromRunnable(() -> {
                    try {
                        Message.creator(
                                new PhoneNumber(phone),
                                new PhoneNumber(smsFrom),
                                message
                        ).create();
                        log.info("SMS sent to {}", phone);
                    } catch (Exception e) {
                        log.error("Failed to send SMS to {}: {}", phone, e.getMessage());
                    }
                })
                .subscribeOn(Schedulers.boundedElastic()) // offload blocking call
                .then(); // return Mono<Void>
    }

    @Async
    @Override
    public void sendTrackingNumber(String email, String trackingNumber) {

        String deliveryLink = String.format("%s/login", frontendBaseUrl);

        String htmlBody = """
        <html>
        <body style="font-family:Arial, sans-serif; line-height:1.6;">
            <p>Hello BukaFreshers,</p>

            <p>Your BukaFresh delivery has been scheduled 🚚</p>

            <p><strong>Tracking Number:</strong> %s</p>

            <p>You can track your delivery by following these steps:</p>

            <ol>
                <li>Log in to your BukaFresh account</li>
                <li>Go to <strong>Deliveries</strong></li>
                <li>Click on <strong>Track Delivery</strong></li>
                <li>Enter the tracking number above</li>
            </ol>

            <p>
                <a href="%s"
                   style="display:inline-block;
                          padding:5px 10px;
                          font-size:16px;
                          font-weight:600;
                          background-color:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:5px;">
                    Log in to Track Delivery
                </a>
            </p>

            <br/>
            <p>Thank you for choosing BukaFresh 🥬<br/>
               BukaFresh Customer Success Team</p>
        </body>
        </html>
        """.formatted(
                trackingNumber,
                deliveryLink
        );

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(email)
                .subject("Track Your BukaFresh Delivery 🚚")
                .messageBody(htmlBody)
                .isHtml(true)
                .build();

        emailService.sendEmailAlert(emailDetails);
    }

//
//    @Override
//    public Mono<Void> sendWhatsapp(String phone, String message) {
//        return Mono.fromRunnable(() -> {
//                    try {
//                        whatsappClient.sendMessage(phone, message); // your blocking call
//                        log.info("WhatsApp message sent to {}", phone);
//                    } catch (Exception e) {
//                        log.error("Failed to send WhatsApp message to {}: {}", phone, e.getMessage());
//                        throw new RuntimeException(e);
//                    }
//                })
//                .subscribeOn(Schedulers.boundedElastic())
//                .then();
//    }

}
