package com.jdsn.notificationservice.service;

import com.jdsn.notificationservice.client.UserClient;
import com.jdsn.notificationservice.dto.NotificationResponse;
import com.jdsn.notificationservice.dto.UserDto;
import com.jdsn.notificationservice.event.ExpiryAlertEvent;
import com.jdsn.notificationservice.exceptions.BusinessException;
import com.jdsn.notificationservice.model.Notification;
import com.jdsn.notificationservice.model.NotificationType;
import com.jdsn.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    //private final SimpMessagingTemplate messagingTemplate;
    private final UserClient userClient;

    private static final List<String> ALERT_ROLES =
            List.of("ROLE_MANAGER", "ROLE_SALES");

    private static final int WARNING_DAYS = 7;

    // =========================
    // 1) Generar notificaciones
    // =========================
    @Transactional
    public void generateExpiryNotifications(ExpiryAlertEvent event) {
        List<UserDto> users = userClient.getUsersByRoles(ALERT_ROLES);
        NotificationType type = event.getDaysUntilExpiry() <=0
                ? NotificationType.CRITICAL
                : NotificationType.WARNING;
        String title = type == NotificationType.CRITICAL
                ? "Producto vencido"
                : "Producto próximo a vencer";

        String message = type == NotificationType.CRITICAL
                ? "El producto \"" + event.getProductName() + "\" está vencido."
                : "El producto \"" + event.getProductName()
                + "\" vence en " + event.getDaysUntilExpiry() + " días.";

        for (UserDto user : users) {
            boolean exists = notificationRepository
                    .existsByUserIdAndProductIdAndType(
                            user.getId(),
                            event.getProductId(),
                            type);
            if (exists) continue;

            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setProductId(event.getProductId());
            notification.setProductName(event.getProductName());
            notification.setType(type);
            notification.setTitle(title);
            notification.setMessage(message);

            notificationRepository.save(notification);
//            messagingTemplate.convertAndSend(
//                    "/topic/notifications/" + user.getId(),
//                    NotificationResponse.fromEntity(notification));

        }
    }

    private NotificationType classifyExpiry(LocalDate today, LocalDate warningLimit, LocalDate dueDate) {
        // CRITICAL: dueDate <= today
        if (!dueDate.isAfter(today)) {
            return NotificationType.CRITICAL;
        }
        // WARNING: hoy < dueDate <= warningLimit
        if (!dueDate.isAfter(warningLimit)) {
            return NotificationType.WARNING;
        }
        // Más allá del límite → sin notificación
        return null;
    }

    // =====================================
    // 2) Operaciones para el usuario actual
    // =====================================

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long countUnread(String userId) {
        return notificationRepository.countByUserIdAndReadFlagFalse(userId);
    }

    @Transactional
    public void markAllAsRead(String userId) {

        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        list.forEach(n -> n.setReadFlag(true));
        // al estar en @Transactional, se sincroniza solo
    }

    @Transactional
    public void deleteNotification( UUID notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BusinessException("Notificación no encontrada"));
        notificationRepository.delete(n);
    }
}
