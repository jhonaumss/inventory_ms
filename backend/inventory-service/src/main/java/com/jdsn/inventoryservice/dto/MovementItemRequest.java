package com.jdsn.inventoryservice.dto;
import com.jdsn.inventoryservice.model.MovementType;

public record MovementItemRequest(
        String productId,
        int quantity,
        MovementType type
) {}

