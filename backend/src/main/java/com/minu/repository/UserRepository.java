package com.minu.repository;

import com.minu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // --- LOOKUP METHOD FOR USERNAME AUTHENTICATION ---
    Optional<User> findByUsername(String username);

    // --- EMAIL INTEGRATION METHODS ---
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}