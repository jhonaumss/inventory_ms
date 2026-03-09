package com.jdsn.notificationservice.repository;

import com.jdsn.notificationservice.model.Notification;
import com.jdsn.notificationservice.model.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    long countByUserIdAndReadFlagFalse(String userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    boolean existsByUserIdAndProductIdAndType(String userId, String productId, NotificationType type);
}
