package com.jdsn.inventoryservice.controller;

import com.jdsn.inventoryservice.model.Product;
import com.jdsn.inventoryservice.service.NotificationService;
import com.jdsn.inventoryservice.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/products")
public class ProductController {

    private final ProductService productService;
    private final NotificationService notificationService;

    public ProductController(ProductService productService, NotificationService notificationService) {
        this.productService = productService;
        this.notificationService = notificationService;
    }
    @PreAuthorize("hasAnyRole('ROLE_SALES', 'ROLE_MANAGER')")
    @GetMapping
    public List<Product> getAll() {
        return productService.findAll();
    }
    @PreAuthorize("hasAnyRole('ROLE_SALES', 'ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        return productService.findById(id)
                .map(existing -> {
                    existing.setName(product.getName());
                    existing.setType(product.getType());
                    existing.setBrand(product.getBrand());
                    existing.setDueDate(product.getDueDate());
                    existing.setQuantity(product.getQuantity());
                    return ResponseEntity.ok(productService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate-notifications")
    public ResponseEntity<Void> generate() {
        notificationService.generateExpiryNotifications();
        return ResponseEntity.ok().build();
    }
}

