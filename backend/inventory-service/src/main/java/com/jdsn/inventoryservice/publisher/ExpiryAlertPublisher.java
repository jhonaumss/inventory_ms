package com.jdsn.inventoryservice.publisher;

import com.jdsn.inventoryservice.event.ExpiryAlertEvent;
import com.jdsn.inventoryservice.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class ExpiryAlertPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange:inventory.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.expiry-alert:inventory.expiry-alert}")
    private String routingKey;

    public void publishExpiryAlert(Product product) {
        long daysUntilExpiry = LocalDate.now()
                .until(product.getDueDate(), ChronoUnit.DAYS);

        ExpiryAlertEvent event = ExpiryAlertEvent.builder()
                .productId(String.valueOf(product.getId()))
                .productName(product.getName())
                .dueDate(product.getDueDate())
                .daysUntilExpiry((int) daysUntilExpiry)
                .detectedAt(Instant.now())
                .build();

        rabbitTemplate.convertAndSend(exchange, routingKey, event);
    }
}
