package com.jdsn.inventoryservice.service;

import com.jdsn.inventoryservice.publisher.ExpiryAlertPublisher;
import com.jdsn.inventoryservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final ProductRepository productRepository;
    private final ExpiryAlertPublisher expiryAlertPublisher;
    public void generateExpiryNotifications() {
        productRepository
                .findByDueDateLessThanEqualAndActiveTrue(LocalDate.now().plusDays(7))
                .forEach(expiryAlertPublisher::publishExpiryAlert);;
    }
}
