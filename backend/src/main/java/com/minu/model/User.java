package com.minu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @JsonProperty("username")
    @Column(nullable = false, unique = true)
    private String username;

    @JsonProperty("email")
    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @JsonProperty("role")
    private Role role = Role.STUDENT;

    @JsonProperty("totalQuizzesTaken")
    @Column(nullable = false)
    private Integer totalQuizzesTaken = 0;

    @JsonProperty("averageScore")
    @Column(nullable = false)
    private Double averageScore = 0.0;

    @JsonProperty("achievementsCount")
    @Column(nullable = false)
    private Integer achievementsCount = 0;
    
    // ... rest of your model ...
}