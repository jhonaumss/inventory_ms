package com.jdsn.authservice.repository;

import com.jdsn.authservice.model.Role;
import com.jdsn.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    List<User> findByRoleIn(Collection<Role> roles);

    Collection<User> findByRoleNameIn(List<String> roles);
}
