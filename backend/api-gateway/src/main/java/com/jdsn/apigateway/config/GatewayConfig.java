package com.jdsn.apigateway.config;

import com.jdsn.apigateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public GatewayConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f.filter(jwtFilter))
                        .uri("lb://auth-service"))
                .route("inventory-service", r -> r
                        .path("/api/inventory/**")
                        .filters(f -> f.filter(jwtFilter))
                        .uri("lb://inventory-service"))
                .route("notification-service", r -> r
                        .path("/api/notifications/**")
                        .filters(f -> f.filter(jwtFilter))
                        .uri("lb://notification-service"))
                .build();
    }
}
