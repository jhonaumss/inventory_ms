package com.jdsn.apigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GatewayFilter {
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Routes that don't require authentication
    private final List<String> publicRoutes = List.of(
            "/api/auth/login"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();

        // Allow public routes through
        if (isPublicRoute(path)) {
            return chain.filter(exchange);
        }

        // Check Authorization header
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = validateToken(token);
            List<String> roles = claims.get("roles", List.class);
            String rolesHeader = String.join(",", roles);
            // Forward user info to downstream services via headers
            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(r -> r
                            .header("X-User-Id", claims.getSubject())
                            .header("X-User-Roles", rolesHeader)
                    )
                    .build();
            return chain.filter(mutatedExchange);

        } catch (JwtException e) {
            return unauthorized(exchange);
        }
    }

    private Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isPublicRoute(String path) {
        return publicRoutes.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
