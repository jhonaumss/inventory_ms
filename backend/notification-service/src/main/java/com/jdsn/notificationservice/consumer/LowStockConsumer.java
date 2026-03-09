package com.jdsn.notificationservice.consumer;

import com.jdsn.notificationservice.event.LowStockEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LowStockConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    //@RabbitListener(queues = "${rabbitmq.queue.low-stock}")
    public void consume(LowStockEvent event) {
        log.warn("Low stock alert received: product={}, stock={}/{}",
                event.getProductName(),
                event.getCurrentStock(),
                event.getMinStock());

        // Push to WebSocket — only ADMIN and MANAGER are subscribed to this
        messagingTemplate.convertAndSend("/topic/notifications/low-stock", event);
    }
}
