package com.minu.repository;

import com.minu.model.Question;
import com.minu.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizOrderByDisplayOrder(Quiz quiz);

    List<Question> findByQuiz(Quiz quiz);

    long countByQuiz(Quiz quiz);
}
