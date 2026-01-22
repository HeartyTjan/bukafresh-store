package com.dark_store.bukafresh_backend.util;

import com.dark_store.bukafresh_backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BillingScheduler {

    private final SubscriptionService subscriptionService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void runDailyBilling() {
        subscriptionService.processDueSubscriptions();
    }
}
