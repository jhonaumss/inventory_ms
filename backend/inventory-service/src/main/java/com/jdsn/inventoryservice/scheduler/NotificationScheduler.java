// pg/project/inventory_backend/scheduler/NotificationScheduler.java
package com.jdsn.inventoryservice.scheduler;

import com.jdsn.inventoryservice.publisher.ExpiryAlertPublisher;
import com.jdsn.inventoryservice.repository.ProductRepository;
import com.jdsn.inventoryservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {
    private final NotificationService notificationService;

    // Todos los días a las 08:00
    @Scheduled(cron = "0 0 8 * * *")
    public void scheduleExpiryNotifications() {
        notificationService.generateExpiryNotifications();
    }
}
