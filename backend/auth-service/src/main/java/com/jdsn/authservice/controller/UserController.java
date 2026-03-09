package com.jdsn.authservice.controller;

import com.jdsn.authservice.dto.ChangePasswordRequest;
import com.jdsn.authservice.dto.UserRequest;
import com.jdsn.authservice.dto.UserResponse;
import com.jdsn.authservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        System.out.println("Creating user");
        UserResponse createdUser = userService.createUser(request);
        URI location = URI.create("/api/users/" + createdUser.getId());
        return ResponseEntity.created(location).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequest request
    ) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(@PathVariable UUID id,@Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(id, req);
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/by-roles")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_INTERNAL')")
    public ResponseEntity<List<UserResponse>> getUsersByRoles(
            @RequestParam List<String> roles) {
        return ResponseEntity.ok(userService.getUsersByRoles(roles));
    }
}
