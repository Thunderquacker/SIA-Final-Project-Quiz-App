package com.minu.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_history", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_quiz_id", columnList = "quiz_id"),
    @Index(name = "idx_completed_at", columnList = "completed_at"),
    @Index(name = "idx_user_completed", columnList = "user_id,completed_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long quizId;

    @Column(nullable = false)
    private String quizTitle;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Double percentageScore;

    @Column(nullable = false)
    private LocalDateTime completedAt = LocalDateTime.now();
}
