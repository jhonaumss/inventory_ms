package com.jdsn.inventoryservice.repository;

import com.jdsn.inventoryservice.model.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, UUID> {
}
