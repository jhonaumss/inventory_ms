package com.jdsn.notificationservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LowStockEvent {
    private Long productId;
    private String productName;
    private Integer currentStock;
    private Integer minStock;
    private Instant detectedAt;
}
