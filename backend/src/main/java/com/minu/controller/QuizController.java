package com.minu.controller;

import com.minu.model.QuizHistory;
import com.minu.repository.QuizHistoryRepository;
import com.minu.dto.CreateQuizRequest;
import com.minu.dto.QuizDTO;
import com.minu.security.JwtAuthenticationFilter;
import com.minu.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api") 
public class QuizController {

    @Autowired
    private QuizHistoryRepository quizHistoryRepository;
    
    @Autowired
    private QuizService quizService;

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

    // --- CREATE QUIZ ENDPOINT ---
    @PostMapping("/quizzes")
    public ResponseEntity<?> createQuiz(
            @RequestBody CreateQuizRequest request,
            HttpServletRequest httpRequest
    ) {
        try {
            // Extract userId from JWT token (set by JwtAuthenticationFilter)
            Long userId = (Long) httpRequest.getAttribute("userId");
            
            if (userId == null) {
                return ResponseEntity.status(401).body("{\"error\": \"Unauthorized: User ID not found in token\"}");
            }
            
            QuizDTO createdQuiz = quizService.createQuiz(userId, request);
            
            return ResponseEntity.ok()
                .body("{\"message\": \"Quiz created successfully\", \"quiz\": " + 
                      "{ \"quizId\": " + createdQuiz.getQuizId() + 
                      ", \"title\": \"" + createdQuiz.getTitle().replace("\"", "\\\"") + 
                      "\", \"description\": \"" + (createdQuiz.getDescription() != null ? createdQuiz.getDescription().replace("\"", "\\\"") : "") +
                      "\", \"category\": \"" + createdQuiz.getCategory() + 
                      "\", \"difficulty\": \"" + createdQuiz.getDifficulty() + 
                      "\" } }");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Failed to create quiz: " + e.getMessage() + "\"}");
        }
    }

    // --- GET ALL QUIZZES ENDPOINT ---
    @GetMapping("/quizzes")
    public ResponseEntity<?> getAllQuizzes() {
        try {
            java.util.List<QuizDTO> quizzes = quizService.getAllQuizzes();
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Failed to fetch quizzes: " + e.getMessage() + "\"}");
        }
    }

    // --- GET QUIZZES BY USER ENDPOINT ---
    @GetMapping("/users/{userId}/quizzes")
    public ResponseEntity<?> getUserQuizzes(@PathVariable Long userId) {
        try {
            java.util.List<QuizDTO> quizzes = quizService.getQuizzesByUser(userId);
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Failed to fetch user quizzes: " + e.getMessage() + "\"}");
        }
    }

    // --- GET SINGLE QUIZ ENDPOINT ---
    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<?> getQuizById(@PathVariable Long quizId) {
        try {
            QuizDTO quiz = quizService.getQuiz(quizId);
            if (quiz == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Failed to fetch quiz: " + e.getMessage() + "\"}");
        }
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