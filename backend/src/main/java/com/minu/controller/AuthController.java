package com.minu.controller;

import com.minu.model.User;
import com.minu.repository.UserRepository;
import com.minu.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("{\"error\": \"User not found\"}");
            }
            
            User user = userOpt.get();
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("{\"error\": \"Invalid credentials\"}");
            }
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Server error\"}");
        }
    }
}