package com.minu.controller;

import com.minu.dto.UserProfileDTO;
import com.minu.dto.UpdateUserProfileDTO;
import com.minu.dto.QuizHistoryDTO;
import com.minu.dto.AchievementDTO;
import com.minu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long userId) {
        try {
            UserProfileDTO profile = userService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserProfileDTO updateDTO) {
        try {
            UserProfileDTO updatedProfile = userService.updateUserProfile(userId, updateDTO);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/quiz-history")
    public ResponseEntity<List<QuizHistoryDTO>> getUserQuizHistory(@PathVariable Long userId) {
        try {
            List<QuizHistoryDTO> history = userService.getUserQuizHistory(userId);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/scores")
    public ResponseEntity<List<QuizHistoryDTO>> getUserScores(@PathVariable Long userId) {
        try {
            List<QuizHistoryDTO> scores = userService.getUserScores(userId);
            return ResponseEntity.ok(scores);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/achievements")
    public ResponseEntity<List<AchievementDTO>> getUserAchievements(@PathVariable Long userId) {
        try {
            List<AchievementDTO> achievements = userService.getUserAchievements(userId);
            return ResponseEntity.ok(achievements);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
