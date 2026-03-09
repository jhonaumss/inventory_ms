package com.jdsn.inventoryservice.publisher;

import com.jdsn.inventoryservice.event.LowStockEvent;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class LowStockPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.low-stock}")
    private String lowStockRoutingKey;

    public LowStockPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(LowStockEvent event) {
        rabbitTemplate.convertAndSend(exchange, lowStockRoutingKey, event);
    }
}
