package com.jdsn.notificationservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange:inventory.exchange}")
    private String exchange;

//    @Value("${rabbitmq.queue.low-stock}")
//    private String lowStockQueue;

    @Value("${rabbitmq.queue.expiry-alert:inventory.expiry-alert.queue}")
    private String expiryAlertQueue;

//    @Value("${rabbitmq.routing-key.low-stock:test.queue}")
//    private String lowStockRoutingKey;

    @Value("${rabbitmq.routing-key.expiry-alert:inventory.expiry-alert}")
    private String expiryAlertRoutingKey;

    @Bean
    public TopicExchange inventoryExchange() {
        return new TopicExchange(exchange);
    }

    // Low stock queue and binding
//    @Bean
//    public Queue lowStockQueue() {
//        return new Queue(lowStockQueue, true); // durable=true
//    }

//    @Bean
//    public Binding lowStockBinding() {
//        return BindingBuilder
//                .bind(lowStockQueue())
//                .to(inventoryExchange())
//                .with(lowStockRoutingKey);
//    }

    // Expiry alert queue and binding
    @Bean
    public Queue expiryAlertQueue() {
        return new Queue(expiryAlertQueue, true);
    }

    @Bean
    public Binding expiryAlertBinding() {
        return BindingBuilder
                .bind(expiryAlertQueue())
                .to(inventoryExchange())
                .with(expiryAlertRoutingKey);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
