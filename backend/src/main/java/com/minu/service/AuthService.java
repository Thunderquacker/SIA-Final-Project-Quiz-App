package com.minu.service;

import com.minu.dto.SignupRequest;
import com.minu.dto.LoginRequest;
import com.minu.dto.AuthResponse;
import com.minu.model.User;
import com.minu.repository.UserRepository;
import com.minu.exception.DuplicateResourceException;
import com.minu.exception.ResourceNotFoundException;
import com.minu.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        logger.info("Processing signup for email: {}", request.getEmail());

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            logger.warn("Signup failed: Username already exists: {}", request.getUsername());
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Signup failed: Email already exists: {}", request.getEmail());
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .totalQuizzesTaken(0)
                .averageScore(0.0)
                .achievementsCount(0)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("User successfully created with id: {}", savedUser.getUserId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getUserId(), savedUser.getEmail());

        return AuthResponse.of(token, savedUser.getUserId(), savedUser.getUsername(), savedUser.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        logger.info("Processing login for email: {}", request.getEmail());

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed: User not found with email: {}", request.getEmail());
                    return new ResourceNotFoundException("User not found with email: " + request.getEmail());
                });

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed: Invalid password for email: {}", request.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        logger.info("User successfully authenticated with id: {}", user.getUserId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

        return AuthResponse.of(token, user.getUserId(), user.getUsername(), user.getEmail());
    }
}
