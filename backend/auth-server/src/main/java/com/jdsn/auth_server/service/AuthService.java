package com.jdsn.auth_server.service;

import com.jdsn.auth_server.dto.AuthResponse;
import com.jdsn.auth_server.dto.LoginRequest;
import com.jdsn.auth_server.exceptions.PasswordExpiredException;
import com.jdsn.auth_server.model.User;
import com.jdsn.auth_server.repository.UserRepository;
import com.jdsn.auth_server.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final JwtService jwt;

    private static final int PASSWORD_EXPIRATION_DAYS = 90;
    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCK_TIME_MINUTES = 15;

    public AuthResponse login(LoginRequest req) {
        User currentUser = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (isAccountLocked(currentUser)) {
            throw new LockedException("La cuenta está bloqueada. Intente nuevamente más tarde.");
        }
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
            resetFailedAttempts(currentUser);
            var principal = (org.springframework.security.core.userdetails.User) auth.getPrincipal();
            var roles = principal.getAuthorities().stream().map(a -> a.getAuthority()).toList();

            if (currentUser.getPasswordChangedAt() != null) {
                LocalDateTime expirationDate = currentUser.getPasswordChangedAt().plusDays(PASSWORD_EXPIRATION_DAYS);
                if (LocalDateTime.now().isAfter(expirationDate)) {
                    throw new PasswordExpiredException("La contraseña ha expirado, debe cambiarla.");
                }
            }
            String token = jwt.generate(principal.getUsername(), roles);
            return new AuthResponse(token, currentUser.isMustChangePassword(), currentUser.getId() );
        } catch (BadCredentialsException e) {
            increaseFailedAttempts(currentUser);
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }
    private void increaseFailedAttempts(User user) {
        int newAttempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(newAttempts);

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
            user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(LOCK_TIME_MINUTES));
        }

        userRepository.save(user);
    }

    private void resetFailedAttempts(User user) {
        if (user.getFailedAttempts() > 0 || user.getAccountLockedUntil() != null) {
            user.setFailedAttempts(0);
            user.setAccountLockedUntil(null);
            userRepository.save(user);
        }
    }

    private boolean isAccountLocked(User user) {
        LocalDateTime lockedUntil = user.getAccountLockedUntil();
        if (lockedUntil == null) return false;

        if (lockedUntil.isAfter(LocalDateTime.now())) {
            return true;
        } else {
            user.setAccountLockedUntil(null);
            user.setFailedAttempts(0);
            userRepository.save(user);
            return false;
        }
    }
}
