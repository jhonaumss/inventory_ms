package com.jdsn.inventoryservice.repository;


import com.jdsn.inventoryservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByDueDateBetween(LocalDate dueDateAfter, LocalDate dueDateBefore);
    List<Product> findByDueDateLessThanEqual(LocalDate limit);
    Iterable<Product> findByDueDateLessThanEqualAndActiveTrue(LocalDate dueDate);
}
