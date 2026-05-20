package com.minu.controller;

import com.minu.model.User;
import com.minu.model.Role;
import com.minu.repository.UserRepository;
import com.minu.dto.LoginRequest;
import com.minu.dto.SignupRequest;
import com.minu.dto.AuthResponse;
import com.minu.security.JwtTokenProvider;
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
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
                return ResponseEntity.status(400).body("{\"error\": \"Email already registered\"}");
            }

            // Create new user
            User newUser = User.builder()
                    .username(signupRequest.getUsername())
                    .email(signupRequest.getEmail())
                    .password(passwordEncoder.encode(signupRequest.getPassword()))
                    .role(Role.STUDENT)
                    .totalQuizzesTaken(0)
                    .averageScore(0.0)
                    .achievementsCount(0)
                    .build();

            // Save user to database
            User savedUser = userRepository.save(newUser);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(savedUser.getUserId(), savedUser.getEmail());

            // Return AuthResponse
            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .userId(savedUser.getUserId())
                    .username(savedUser.getUsername())
                    .email(savedUser.getEmail())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Signup failed: " + e.getMessage() + "\"}");
        }
    }

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
            
            // Generate JWT token
            String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

            // Return AuthResponse
            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .userId(user.getUserId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Login failed\"}");
        }
    }
}