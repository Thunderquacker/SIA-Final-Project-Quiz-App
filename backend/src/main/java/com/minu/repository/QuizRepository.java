package com.minu.repository;

import com.minu.model.Quiz;
import com.minu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserOrderByCreatedAtDesc(User user);

    List<Quiz> findByUser(User user);

    @Query("SELECT q FROM Quiz q WHERE q.user = ?1 ORDER BY q.createdAt DESC LIMIT ?2")
    List<Quiz> findLatestQuizzesByUser(User user, int limit);

    List<Quiz> findByCategoryOrderByCreatedAtDesc(String category);
}
