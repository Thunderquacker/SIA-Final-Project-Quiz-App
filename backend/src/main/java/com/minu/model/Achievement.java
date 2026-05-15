package com.minu.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements", indexes = {
    @Index(name = "idx_user_id_achievement", columnList = "user_id"),
    @Index(name = "idx_achievement_type", columnList = "type"),
    @Index(name = "idx_unlocked_at", columnList = "unlocked_at"),
    @Index(name = "idx_user_unlocked", columnList = "user_id,unlocked_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(length = 255)
    private String badgeUrl;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private LocalDateTime unlockedAt = LocalDateTime.now();
}
