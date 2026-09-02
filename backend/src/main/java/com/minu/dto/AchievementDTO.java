package com.minu.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementDTO {
    private Long achievementId;
    private String title;
    private String description;
    private String badgeUrl;
    private String type;
    private LocalDateTime unlockedAt;
}
