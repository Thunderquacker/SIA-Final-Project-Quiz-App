package com.example.quizapp.service;

import com.example.quizapp.dto.QuizSubmission;
import com.example.quizapp.model.Question;
import com.example.quizapp.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuestionRepository repository;

    public int calculateScore(List<QuizSubmission> submissions) {
        int score = 0;
        for (QuizSubmission sub : submissions) {
            Question q = repository.findById(sub.getQuestionId()).orElse(null);
            if (q != null && q.getCorrectAnswer().equalsIgnoreCase(sub.getSelectedOption())) {
                score++;
            }
        }
        return score;
    }
}