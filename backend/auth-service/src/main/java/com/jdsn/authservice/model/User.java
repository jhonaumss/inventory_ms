package com.jdsn.authservice.model;

import com.jdsn.authservice.dto.UserResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
//@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // will be encrypted with BCrypt

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean mustChangePassword = true;

    @Column(nullable = false)
    private int failedAttempts = 0;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
     public UserResponse toResponse() {
        return new UserResponse(this.id, this.username, this.email, this.role.getName(), this.enabled, this.mustChangePassword);
     }
}
