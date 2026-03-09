package com.jdsn.authservice.dto;

import java.util.UUID;

public record AuthResponse(String token, boolean mustChangePassword, UUID id) {
}
