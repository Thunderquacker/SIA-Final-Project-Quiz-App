package com.minu.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuizRequest {
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private List<QuestionRequest> questions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionRequest {
        private String questionText;
        private Integer displayOrder;
        private List<OptionRequest> options;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionRequest {
        private String optionText;
        private Boolean isCorrect;
        private Integer displayOrder;
    }
}
