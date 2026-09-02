-- Insert test user
INSERT INTO users (user_id, username, email, bio, profile_image_url, total_quizzes_taken, average_score, achievements_count, created_at, updated_at) 
VALUES (1, 'sarah_john', 'sarah@example.com', 'Quiz enthusiast and educator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 8, 78.5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert quiz history
INSERT INTO quiz_history (history_id, user_id, quiz_id, quiz_title, score, total_questions, percentage_score, completed_at) 
VALUES 
(1, 1, 101, 'General Knowledge Quiz', 8, 10, 80.0, CURRENT_TIMESTAMP - INTERVAL '5' DAY),
(2, 1, 102, 'Biology Basics', 7, 10, 70.0, CURRENT_TIMESTAMP - INTERVAL '4' DAY),
(3, 1, 103, 'History Timeline', 9, 10, 90.0, CURRENT_TIMESTAMP - INTERVAL '3' DAY),
(4, 1, 104, 'Math Problem Solving', 6, 10, 60.0, CURRENT_TIMESTAMP - INTERVAL '2' DAY),
(5, 1, 105, 'Science Facts', 8, 10, 80.0, CURRENT_TIMESTAMP - INTERVAL '1' DAY),
(6, 1, 106, 'World Capitals', 9, 10, 90.0, CURRENT_TIMESTAMP - INTERVAL '6' HOUR),
(7, 1, 107, 'Literature Classics', 7, 10, 70.0, CURRENT_TIMESTAMP - INTERVAL '3' HOUR),
(8, 1, 108, 'Technology Trends', 8, 10, 80.0, CURRENT_TIMESTAMP - INTERVAL '1' HOUR);

-- Insert achievements
INSERT INTO achievements (achievement_id, user_id, title, description, badge_url, type, unlocked_at) 
VALUES 
(1, 1, 'Quiz Master', 'Complete 5 quizzes', 'https://api.dicebear.com/7.x/icons/svg?seed=master', 'COMPLETION', CURRENT_TIMESTAMP - INTERVAL '2' DAY),
(2, 1, 'Perfect Score', 'Score 100% on a quiz', 'https://api.dicebear.com/7.x/icons/svg?seed=perfect', 'ACHIEVEMENT', CURRENT_TIMESTAMP - INTERVAL '1' DAY),
(3, 1, 'Consistent Learner', 'Maintain average score above 75%', 'https://api.dicebear.com/7.x/icons/svg?seed=consistent', 'ACHIEVEMENT', CURRENT_TIMESTAMP - INTERVAL '6' HOUR);
