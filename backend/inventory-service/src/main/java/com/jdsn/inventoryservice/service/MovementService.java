package com.jdsn.inventoryservice.service;

import com.jdsn.inventoryservice.dto.MovementItemRequest;
import com.jdsn.inventoryservice.dto.MovementRequest;
import com.jdsn.inventoryservice.exceptions.BusinessException;
import com.jdsn.inventoryservice.model.InventoryMovement;
import com.jdsn.inventoryservice.model.MovementType;
import com.jdsn.inventoryservice.model.Product;
import com.jdsn.inventoryservice.repository.InventoryMovementRepository;
import com.jdsn.inventoryservice.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MovementService {

    private final ProductRepository productRepository;
    private final InventoryMovementRepository movementRepo;

    @Transactional
    public void registerMovements(MovementRequest request, String username, boolean isManager) {
        for (MovementItemRequest item : request.items()) {

            Product product = productRepository.findById(Long.valueOf(item.productId()))
                    .orElseThrow(() -> new BusinessException("Product not found"));

            int quantity = item.quantity();
            if (quantity <= 0) throw new BusinessException("Quantity must be > 0");

            MovementType type;
            if (isManager) {
                type = item.type(); // manager elige
                if (type == null) throw new BusinessException("Type required for manager");
            } else {
                type = MovementType.SALE; // vendedor always SALE
            }

            // Stock update (solo salidas por ahora)
            product.setQuantity(product.getQuantity() - quantity);
            if (product.getQuantity() < 0) throw new BusinessException("Insufficient stock");
            productRepository.save(product);

            // Movement record
            InventoryMovement mv = new InventoryMovement();
            mv.setProduct(product);
            mv.setUsername(username);
            mv.setQuantityChange(-quantity); // salida negativa
            mv.setType(type);
            movementRepo.save(mv);
        }
    }
}

