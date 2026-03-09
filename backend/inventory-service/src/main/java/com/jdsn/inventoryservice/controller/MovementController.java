package com.jdsn.inventoryservice.controller;

import com.jdsn.inventoryservice.dto.MovementRequest;
import com.jdsn.inventoryservice.service.MovementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory/movements")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PreAuthorize("hasAnyRole('ROLE_SALES','ROLE_MANAGER')")
    @PostMapping
    public ResponseEntity<Void> registerMovement(
            @Valid @RequestBody MovementRequest request,
            Authentication auth
    ) {
        String username = auth.getName();
        boolean isManager = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
        movementService.registerMovements(request, username, isManager);
        return ResponseEntity.ok().build();
    }
}
