package com.jdsn.inventoryservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LowStockEvent {
    private UUID productId;
    private String productName;
    private String sku;
    private Integer currentStock;
    private Integer minStock;
    private Instant detectedAt;
}
