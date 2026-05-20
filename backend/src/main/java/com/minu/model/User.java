package com.minu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

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

    @JsonProperty("bio")
    @Column(columnDefinition = "TEXT")
    private String bio;

    @JsonProperty("profileImageUrl")
    @Column(length = 500)
    private String profileImageUrl;

    @JsonProperty("createdAt")
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Achievement> achievements;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}