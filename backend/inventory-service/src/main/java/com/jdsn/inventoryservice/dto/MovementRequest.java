package com.jdsn.inventoryservice.dto;

import java.util.List;

public record MovementRequest (
        List<MovementItemRequest> items
){}
