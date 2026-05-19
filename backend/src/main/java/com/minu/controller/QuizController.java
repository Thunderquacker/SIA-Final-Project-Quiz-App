package com.minu.controller;

import com.minu.model.QuizHistory;
import com.minu.repository.QuizHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api") 
public class QuizController {

    @Autowired
    private QuizHistoryRepository quizHistoryRepository;

    // --- DATA TRANSFERS CONTRACT OBJECT FOR SCORE AMENDMENTS ---
    public static class ScoreUpdateRequest {
        private int score;
        private double percentageScore;

        // Getters and Setters
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public double getPercentageScore() { return percentageScore; }
        public void setPercentageScore(double percentageScore) { this.percentageScore = percentageScore; }
    }

    // --- SCORE OVERRIDE MANAGEMENT ENDPOINT LINK ---
    @PutMapping("/history/{historyId}/update-score") 
    public ResponseEntity<?> updateStudentScore(
            @PathVariable Long historyId,
            @RequestBody ScoreUpdateRequest request
    ) {
        return quizHistoryRepository.findById(historyId)
            .map(record -> {
                try {
                    // 1. Structural Constraints Validation Guard
                    if (request.getScore() < 0 || request.getScore() > record.getTotalQuestions()) {
                        return ResponseEntity.badRequest()
                            .body("Boundary Exception: Raw points must fall between 0 and " + record.getTotalQuestions());
                    }

                    // 2. Hydrate property values into data entities 
                    record.setScore(request.getScore());
                    record.setPercentageScore(request.getPercentageScore());

                    // 3. Commit state change transactions downstream to minudb storage files
                    quizHistoryRepository.save(record);

                    return ResponseEntity.ok()
                        .body("Student record metrics re-calculated and saved successfully.");

                } catch (Exception e) {
                    return ResponseEntity.internalServerError()
                        .body("Data Persistence Layer Process Modification Error: " + e.getMessage());
                }
            })
            .orElseGet(() -> ResponseEntity.notFound().build()); 
    }
}