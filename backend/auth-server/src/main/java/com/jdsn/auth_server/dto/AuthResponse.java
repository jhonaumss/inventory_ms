package com.jdsn.auth_server.dto;

import java.util.UUID;

public record AuthResponse(String token, boolean mustChangePassword, UUID id) {
}
