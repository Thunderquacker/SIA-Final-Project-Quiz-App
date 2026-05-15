package com.minu.service;

import com.minu.dto.UserProfileDTO;
import com.minu.dto.UpdateUserProfileDTO;
import com.minu.dto.QuizHistoryDTO;
import com.minu.dto.AchievementDTO;
import com.minu.dto.PageResponse;
import com.minu.model.User;
import com.minu.model.QuizHistory;
import com.minu.model.Achievement;
import com.minu.repository.UserRepository;
import com.minu.repository.QuizHistoryRepository;
import com.minu.repository.AchievementRepository;
import com.minu.exception.ResourceNotFoundException;
import com.minu.exception.DuplicateResourceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizHistoryRepository quizHistoryRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        logger.debug("Fetching user profile for userId: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
        return mapUserToProfileDTO(user);
    }

    @Transactional
    public UserProfileDTO updateUserProfile(Long userId, UpdateUserProfileDTO updateDTO) {
        logger.debug("Updating user profile for userId: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found for update with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        // Check if new username is already in use (by another user)
        if (updateDTO.getUsername() != null && !updateDTO.getUsername().isBlank()) {
            if (!updateDTO.getUsername().equals(user.getUsername()) &&
                userRepository.findByUsername(updateDTO.getUsername()).isPresent()) {
                logger.warn("Duplicate username during update: {}", updateDTO.getUsername());
                throw new DuplicateResourceException("Username already exists: " + updateDTO.getUsername());
            }
            user.setUsername(updateDTO.getUsername());
        }

        // Check if new email is already in use (by another user)
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isBlank()) {
            if (!updateDTO.getEmail().equals(user.getEmail()) &&
                userRepository.findByEmail(updateDTO.getEmail()).isPresent()) {
                logger.warn("Duplicate email during update: {}", updateDTO.getEmail());
                throw new DuplicateResourceException("Email already exists: " + updateDTO.getEmail());
            }
            user.setEmail(updateDTO.getEmail());
        }

        if (updateDTO.getBio() != null) {
            user.setBio(updateDTO.getBio());
        }
        if (updateDTO.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updateDTO.getProfileImageUrl());
        }

        User updatedUser = userRepository.save(user);
        logger.info("User profile updated successfully for userId: {}", userId);
        return mapUserToProfileDTO(updatedUser);
    }

    @Transactional(readOnly = true)
    public List<QuizHistoryDTO> getUserQuizHistory(Long userId) {
        logger.debug("Fetching quiz history for userId: {}", userId);
        userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found for quiz history with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
        
        List<QuizHistory> history = quizHistoryRepository.findByUserUserIdOrderByCompletedAtDesc(userId);
        logger.debug("Found {} quiz history records for userId: {}", history.size(), userId);
        return history.stream()
                .map(this::mapQuizHistoryToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<QuizHistoryDTO> getPaginatedQuizHistory(Long userId, int page, int size) {
        logger.debug("Fetching paginated quiz history for userId: {}, page: {}, size: {}", userId, page, size);
        
        userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found for paginated quiz history with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
        
        Pageable pageable = PageRequest.of(page, size);
        Page<QuizHistory> historyPage = quizHistoryRepository.findByUserUserIdOrderByCompletedAtDesc(userId, pageable);
        
        List<QuizHistoryDTO> content = historyPage.getContent().stream()
                .map(this::mapQuizHistoryToDTO)
                .collect(Collectors.toList());
        
        logger.debug("Found {} quiz history records (page {} of {}) for userId: {}", 
                    content.size(), page, historyPage.getTotalPages(), userId);
        
        return PageResponse.of(content, page, size, historyPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<AchievementDTO> getUserAchievements(Long userId) {
        logger.debug("Fetching achievements for userId: {}", userId);
        userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found for achievements with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
        
        List<Achievement> achievements = achievementRepository.findByUserUserIdOrderByUnlockedAtDesc(userId);
        logger.debug("Found {} achievements for userId: {}", achievements.size(), userId);
        return achievements.stream()
                .map(this::mapAchievementToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizHistoryDTO> getUserScores(Long userId) {
        logger.debug("Fetching quiz scores for userId: {}", userId);
        return getUserQuizHistory(userId);
    }

    @Transactional
    public QuizHistoryDTO recordQuizCompletion(Long userId, Long quizId, String quizTitle, 
                                      Integer score, Integer totalQuestions) {
        logger.info("Recording quiz completion for userId: {}, quizId: {}", userId, quizId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found for quiz recording with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        Double percentageScore = (score.doubleValue() / totalQuestions) * 100;

        // Create quiz history record
        QuizHistory history = QuizHistory.builder()
                .user(user)
                .quizId(quizId)
                .quizTitle(quizTitle)
                .score(score)
                .totalQuestions(totalQuestions)
                .percentageScore(percentageScore)
                .completedAt(LocalDateTime.now())
                .build();

        QuizHistory savedHistory = quizHistoryRepository.save(history);
        logger.debug("Quiz history saved for userId: {}", userId);

        // Update user statistics
        updateUserStatistics(user);
        logger.info("Quiz completion recorded and statistics updated for userId: {}", userId);
        
        return mapQuizHistoryToDTO(savedHistory);
    }

    @Transactional
    public AchievementDTO unlockAchievement(Long userId, String title, String description, 
                                   String badgeUrl, String type) {
        logger.info("Unlocking achievement for userId: {}, title: {}", userId, title);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found for achievement unlock with id: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        // Check if achievement already unlocked
        boolean exists = user.getAchievements() != null && 
                        user.getAchievements().stream()
                        .anyMatch(a -> a.getTitle().equals(title));

        if (exists) {
            logger.warn("Achievement already unlocked for userId: {}, title: {}", userId, title);
            throw new DuplicateResourceException("Achievement already unlocked: " + title);
        }

        Achievement achievement = Achievement.builder()
                .user(user)
                .title(title)
                .description(description)
                .badgeUrl(badgeUrl)
                .type(type)
                .unlockedAt(LocalDateTime.now())
                .build();

        Achievement savedAchievement = achievementRepository.save(achievement);

        // Update achievement count
        user.setAchievementsCount(user.getAchievementsCount() + 1);
        userRepository.save(user);

        logger.info("Achievement unlocked successfully for userId: {}, title: {}", userId, title);
        
        return mapAchievementToDTO(savedAchievement);
    }

    private void updateUserStatistics(User user) {
        List<QuizHistory> histories = quizHistoryRepository.findByUserUserIdOrderByCompletedAtDesc(user.getUserId());

        if (!histories.isEmpty()) {
            // Update total quizzes taken
            user.setTotalQuizzesTaken(histories.size());

            // Calculate average score
            Double averageScore = histories.stream()
                    .mapToDouble(QuizHistory::getPercentageScore)
                    .average()
                    .orElse(0.0);
            user.setAverageScore(Math.round(averageScore * 100.0) / 100.0);

            userRepository.save(user);
            logger.debug("User statistics updated - totalQuizzes: {}, averageScore: {}", 
                        user.getTotalQuizzesTaken(), user.getAverageScore());
        }
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
