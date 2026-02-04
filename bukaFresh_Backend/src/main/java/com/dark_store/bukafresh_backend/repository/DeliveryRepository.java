package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends MongoRepository<Delivery, String> {
    
    List<Delivery> findByUserIdOrderByScheduledDateDesc(String userId);
    
    List<Delivery> findBySubscriptionIdOrderByScheduledDateDesc(String subscriptionId);
    
    List<Delivery> findByUserIdAndStatusOrderByScheduledDateDesc(String userId, String status);
    
    @Query("{'userId': ?0, 'status': {'$in': ?1}}")
    List<Delivery> findByUserIdAndStatusIn(String userId, List<String> statuses);
    
    Optional<Delivery> findByTrackingNumber(String trackingNumber);
    
    List<Delivery> findByScheduledDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("{'status': {'$in': ['SCHEDULED', 'PREPARING', 'OUT_FOR_DELIVERY']}}")
    List<Delivery> findActiveDeliveries();
}