package com.jdsn.inventoryservice.model;

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
public class InventoryMovement {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    private Product product;

    private int quantityChange; // negativo para salidas

    @Enumerated(EnumType.STRING)
    private MovementType type;

    private String username; // quien lo hizo

    private LocalDateTime createdAt = LocalDateTime.now();
}
