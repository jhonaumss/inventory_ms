package com.jdsn.notificationservice.consumer;

import com.jdsn.notificationservice.event.ExpiryAlertEvent;
import com.jdsn.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ExpiryAlertConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @RabbitListener(queues = "${rabbitmq.queue.expiry-alert:inventory.expiry-alert.queue}")
    public void consume(ExpiryAlertEvent event) {
        log.warn("Expiry alert received: product={}, daysUntilExpiry={}",
                event.getProductName(),
                event.getDaysUntilExpiry());
        notificationService.generateExpiryNotifications(event);
        // Push to WebSocket
//        messagingTemplate.convertAndSend(
//                "/topic/notifications/expiry-alert", event);
    }
}
