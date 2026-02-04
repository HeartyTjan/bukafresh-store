package com.dark_store.bukafresh_backend.service;

import com.dark_store.bukafresh_backend.dto.response.DeliveryResponse;
import com.dark_store.bukafresh_backend.model.Delivery;

import java.util.List;

public interface DeliveryService {

    Delivery createDeliveryFromPayment(String paymentId, String subscriptionId);

    List<DeliveryResponse> getUserDeliveries();

    List<DeliveryResponse> getUpcomingDeliveries();

    List<DeliveryResponse> getPastDeliveries();

    DeliveryResponse getDeliveryById(String deliveryId);

    DeliveryResponse updateDeliveryStatus(String deliveryId, String status, String notes);

    DeliveryResponse rescheduleDelivery(String deliveryId, String newDateTime);

    DeliveryResponse cancelDelivery(String deliveryId, String reason);

    DeliveryResponse getDeliveryByTrackingNumber(String trackingNumber);
}