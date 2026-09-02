package com.minu.service;

import com.minu.dto.UserProfileDTO;
import com.minu.dto.UpdateUserProfileDTO;
import com.minu.dto.QuizHistoryDTO;
import com.minu.dto.AchievementDTO;
import com.minu.model.User;
import com.minu.model.QuizHistory;
import com.minu.model.Achievement;
import com.minu.repository.UserRepository;
import com.minu.repository.QuizHistoryRepository;
import com.minu.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizHistoryRepository quizHistoryRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapUserToProfileDTO(user);
    }

    public UserProfileDTO updateUserProfile(Long userId, UpdateUserProfileDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (updateDTO.getUsername() != null && !updateDTO.getUsername().isBlank()) {
            user.setUsername(updateDTO.getUsername());
        }
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isBlank()) {
            user.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getBio() != null) {
            user.setBio(updateDTO.getBio());
        }
        if (updateDTO.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updateDTO.getProfileImageUrl());
        }

        User updatedUser = userRepository.save(user);
        return mapUserToProfileDTO(updatedUser);
    }

    public List<QuizHistoryDTO> getUserQuizHistory(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        List<QuizHistory> history = quizHistoryRepository.findByUserUserIdOrderByCompletedAtDesc(userId);
        return history.stream()
                .map(this::mapQuizHistoryToDTO)
                .collect(Collectors.toList());
    }

    public List<AchievementDTO> getUserAchievements(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        List<Achievement> achievements = achievementRepository.findByUserUserIdOrderByUnlockedAtDesc(userId);
        return achievements.stream()
                .map(this::mapAchievementToDTO)
                .collect(Collectors.toList());
    }

    public List<QuizHistoryDTO> getUserScores(Long userId) {
        return getUserQuizHistory(userId);
    }

    private UserProfileDTO mapUserToProfileDTO(User user) {
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .totalQuizzesTaken(user.getTotalQuizzesTaken())
                .averageScore(user.getAverageScore())
                .achievementsCount(user.getAchievementsCount())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private QuizHistoryDTO mapQuizHistoryToDTO(QuizHistory history) {
        return QuizHistoryDTO.builder()
                .historyId(history.getHistoryId())
                .quizId(history.getQuizId())
                .quizTitle(history.getQuizTitle())
                .score(history.getScore())
                .totalQuestions(history.getTotalQuestions())
                .percentageScore(history.getPercentageScore())
                .completedAt(history.getCompletedAt())
                .build();
    }

    private AchievementDTO mapAchievementToDTO(Achievement achievement) {
        return AchievementDTO.builder()
                .achievementId(achievement.getAchievementId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .badgeUrl(achievement.getBadgeUrl())
                .type(achievement.getType())
                .unlockedAt(achievement.getUnlockedAt())
                .build();
    }
}
