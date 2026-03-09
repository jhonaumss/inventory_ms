package com.jdsn.notificationservice.dto;

import com.jdsn.notificationservice.model.Notification;
import com.jdsn.notificationservice.model.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String title,
        String message,
        NotificationType type,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationResponse fromEntity(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.isReadFlag(),
                n.getCreatedAt()
        );
    }
}
