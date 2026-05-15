package com.minu.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDTO {
    private Long quizId;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Long userId;
    private String username;
    private List<QuestionDTO> questions;
    private Integer questionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
