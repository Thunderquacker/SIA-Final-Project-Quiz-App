package com.minu.model;

public enum AchievementType {
    QUIZ_MASTER("Quiz Master"),
    SPEED_DEMON("Speed Demon"),
    PERFECT_SCORE("Perfect Score"),
    STREAK_5("5 Quiz Streak"),
    STREAK_10("10 Quiz Streak"),
    FIRST_QUIZ("First Quiz Completed"),
    HIGH_SCORER("High Scorer"),
    CONSISTENT_LEARNER("Consistent Learner"),
    TOP_PERFORMER("Top Performer"),
    ACHIEVEMENT_HUNTER("Achievement Hunter");

    private final String displayName;

    AchievementType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static AchievementType fromString(String value) {
        try {
            return AchievementType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid achievement type: " + value);
        }
    }
}
