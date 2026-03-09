package com.jdsn.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRequest {
    @NotBlank(message = "Nombre de usuario es requerido")
    @Size(min = 3, max = 50)
    private String username;
    @Email
    private String email;
    @NotBlank(message = "Role es requerido")
    private String role;
}
