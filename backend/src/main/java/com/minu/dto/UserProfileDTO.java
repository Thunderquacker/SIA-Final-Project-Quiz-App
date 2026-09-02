package com.minu.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private Long userId;
    private String username;
    private String email;
    private String bio;
    private String profileImageUrl;
    private Integer totalQuizzesTaken;
    private Double averageScore;
    private Integer achievementsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
