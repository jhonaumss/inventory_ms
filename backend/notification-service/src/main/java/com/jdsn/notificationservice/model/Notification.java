package com.jdsn.notificationservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="notifications")
public class Notification
{
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String userId;              // dueño de la notificación

    private String title;           // "Alerta de caducidad"
    @Column(length = 500)
    private String message;         // "El producto Leche vence hoy"

    @Enumerated(EnumType.STRING)
    private NotificationType type;  // WARNING, CRITICAL, INFO

    @Column(nullable = false)
    private String productId;
    private String productName;

    private boolean readFlag = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
