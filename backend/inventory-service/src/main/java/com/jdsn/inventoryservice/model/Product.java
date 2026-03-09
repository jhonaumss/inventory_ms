package com.jdsn.inventoryservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String brand;
    private int quantity;

    @Column(nullable = false)
    private int minStock = 5;

    private LocalDate dueDate;
    @Column(nullable = false)
    private boolean active = true;

}
