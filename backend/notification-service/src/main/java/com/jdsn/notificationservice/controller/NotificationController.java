package com.jdsn.notificationservice.controller;

import com.jdsn.notificationservice.dto.NotificationResponse;
import com.jdsn.notificationservice.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_SALES')")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(@PathVariable String userId) {
        var notifs = notificationService.getNotificationsForUser(userId)
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(notifs);
    }

    @GetMapping("/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        long count = notificationService.countUnread(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
