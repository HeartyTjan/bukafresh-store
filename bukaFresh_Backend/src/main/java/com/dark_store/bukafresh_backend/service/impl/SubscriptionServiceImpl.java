package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.model.Subscription;
import com.dark_store.bukafresh_backend.repository.SubscriptionRepository;
import com.dark_store.bukafresh_backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@RequiredArgsConstructor
@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final  SubscriptionRepository subscriptionRepository;

    @Override
    public void processDueSubscriptions() {
        LocalDate today = LocalDate.now();

        List<Subscription> dueSubscriptions = subscriptionRepository.findByNextBillingDate(today);

        for (Subscription sub : dueSubscriptions) {
            // TODO: Call OnePipe collect API to charge customer
            // TODO: Create order in Order collection
            // TODO: Update nextBillingDate
            System.out.println("Processing subscription for user: " + sub.getUserId());
        }
    }
}
