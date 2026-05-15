package com.minu.controller;

import com.minu.dto.CreateQuizRequest;
import com.minu.dto.QuizDTO;
import com.minu.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QuizController {
    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);
    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<?> createQuiz(
        @RequestBody CreateQuizRequest request,
        Authentication auth
    ) {
        try {
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }

            Long userId = (Long) auth.getPrincipal();
            logger.debug("Creating quiz for user: {}", userId);

            QuizDTO createdQuiz = quizService.createQuiz(userId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Quiz created successfully");
            response.put("quiz", createdQuiz);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Failed to create quiz", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to create quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable Long quizId) {
        try {
            QuizDTO quiz = quizService.getQuiz(quizId);
            return ResponseEntity.ok(quiz);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to fetch quiz: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserQuizzes(@PathVariable Long userId) {
        try {
            List<QuizDTO> quizzes = quizService.getQuizzesByUser(userId);
            return ResponseEntity.ok(quizzes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to fetch quizzes: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuizzes() {
        try {
            List<QuizDTO> quizzes = quizService.getAllQuizzes();
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to fetch quizzes: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(
        @PathVariable Long quizId,
        Authentication auth
    ) {
        try {
            if (auth == null || auth.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }

            Long userId = (Long) auth.getPrincipal();
            logger.debug("Deleting quiz {} for user: {}", quizId, userId);

            quizService.deleteQuiz(quizId, userId);

            return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Failed to delete quiz", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete quiz: " + e.getMessage()));
        }
    }
}
