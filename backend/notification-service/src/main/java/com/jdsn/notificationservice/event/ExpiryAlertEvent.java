package com.jdsn.notificationservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpiryAlertEvent {
    private String productId;
    private String productName;
    private LocalDate dueDate;
    private Integer daysUntilExpiry;
    private Instant detectedAt;
}
