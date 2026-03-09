package com.jdsn.authservice.service;

import com.jdsn.authservice.dto.ChangePasswordRequest;
import com.jdsn.authservice.dto.UserRequest;
import com.jdsn.authservice.dto.UserResponse;
import com.jdsn.authservice.model.Role;
import com.jdsn.authservice.model.User;
import com.jdsn.authservice.repository.RoleRepository;
import com.jdsn.authservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserResponse(user);
    }

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        String password = request.getUsername().replace(" ", "") +
                "newUser123#";

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(password)
        );

        Role userRole = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        user.setRole(userRole);
        User userCreated = userRepository.save(user);
        return  toUserResponse(userCreated);
    }
    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());

        if (request.getRole() != null && !request.getRole().isBlank()) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));
            user.setRole(role);
        }

        userRepository.save(user);
        return toUserResponse(user);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName(),
                user.isEnabled(),
                user.isMustChangePassword());
    }

    public void changePassword(UUID id, ChangePasswordRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setMustChangePassword(false);
        user.setPasswordChangedAt(LocalDateTime.now());
        user.setFailedAttempts(0);
        user.setAccountLockedUntil(null);
        userRepository.save(user);
    }

    public List<UserResponse> getUsersByRoles(List<String> roles) {
        return userRepository.findByRoleNameIn(roles)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName(),
                user.isEnabled(),
                user.isMustChangePassword()
        );
    }
}
