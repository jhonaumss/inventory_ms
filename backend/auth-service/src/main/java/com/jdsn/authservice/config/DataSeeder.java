package com.jdsn.authservice.config;

import com.jdsn.authservice.repository.RoleRepository;
import com.jdsn.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.jdsn.authservice.model.Role;
import com.jdsn.authservice.model.User;

@Configuration
public class DataSeeder {
    @Bean
    @Order(1)
    CommandLineRunner seedDB(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) roleRepository.save(new Role("ROLE_ADMIN"));
            if (roleRepository.findByName("ROLE_SALES").isEmpty())  roleRepository.save(new Role("ROLE_SALES"));
            if (roleRepository.findByName("ROLE_MANAGER").isEmpty()) roleRepository.save(new Role("ROLE_MANAGER"));

            if (userRepository.findByUsername("admin").isEmpty()) {
                User user = new User(
                        "admin",
                        "admin@gmail.com",
                        passwordEncoder.encode("admin123#_10")
                );
                // Default role = ROLE_USER
                Role userRole = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("Default role not found"));
                user.setRole(userRole);
                user.setMustChangePassword(false);
                userRepository.save(user);
            }
        };
    }
}
