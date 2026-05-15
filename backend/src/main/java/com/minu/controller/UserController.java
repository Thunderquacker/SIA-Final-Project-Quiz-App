package com.minu.controller;

import com.minu.dto.*;
import com.minu.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

private static final Logger logger = LoggerFactory.getLogger(UserController.class);

@Autowired
private UserService userService;

@GetMapping("/{userId}")
public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long userId) {

    logger.info("Fetching profile for userId: {}", userId);

    UserProfileDTO profile = userService.getUserProfile(userId);

    if (profile == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(profile);
}

@PutMapping("/{userId}")
public ResponseEntity<UserProfileDTO> updateUserProfile(
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserProfileDTO updateDTO) {

    logger.info("Updating profile for userId: {}", userId);

    UserProfileDTO updatedProfile =
            userService.updateUserProfile(userId, updateDTO);

    return ResponseEntity.ok(updatedProfile);
}

@GetMapping("/{userId}/quiz-history")
public ResponseEntity<List<QuizHistoryDTO>> getUserQuizHistory(
        @PathVariable Long userId) {

    logger.info("Fetching quiz history for userId: {}", userId);

    List<QuizHistoryDTO> history =
            userService.getUserQuizHistory(userId);

    return ResponseEntity.ok(history);
}

@GetMapping("/{userId}/scores")
public ResponseEntity<List<QuizHistoryDTO>> getUserScores(
        @PathVariable Long userId) {

    logger.info("Fetching scores for userId: {}", userId);

    List<QuizHistoryDTO> scores =
            userService.getUserScores(userId);

    return ResponseEntity.ok(scores);
}

@GetMapping("/{userId}/achievements")
public ResponseEntity<List<AchievementDTO>> getUserAchievements(
        @PathVariable Long userId) {

    logger.info("Fetching achievements for userId: {}", userId);

    List<AchievementDTO> achievements =
            userService.getUserAchievements(userId);

    return ResponseEntity.ok(achievements);
}

@PostMapping("/{userId}/submit-quiz")
public ResponseEntity<QuizHistoryDTO> submitQuiz(
        @PathVariable Long userId,
        @Valid @RequestBody QuizSubmissionRequest request) {

    logger.info("Submitting quiz for userId: {}", userId);

    QuizHistoryDTO result =
            userService.recordQuizCompletion(
                    userId,
                    request.getQuizId(),
                    request.getQuizTitle(),
                    request.getScore(),
                    request.getTotalQuestions()
            );

    return ResponseEntity.status(HttpStatus.CREATED).body(result);
}

@PostMapping("/{userId}/unlock-achievement")
public ResponseEntity<AchievementDTO> unlockAchievement(
        @PathVariable Long userId,
        @Valid @RequestBody UnlockAchievementRequest request) {

    logger.info("Unlocking achievement for userId: {}", userId);

    AchievementDTO result =
            userService.unlockAchievement(
                    userId,
                    request.getTitle(),
                    request.getDescription(),
                    request.getBadgeUrl(),
                    request.getType()
            );

    return ResponseEntity.status(HttpStatus.CREATED).body(result);
}

}
