package com.example.quizapp.controller;

import com.example.quizapp.dto.QuizSubmission;
import com.example.quizapp.model.Question;
import com.example.quizapp.repository.QuestionRepository;
import com.example.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuestionRepository repository;
    @Autowired
    private QuizService quizService;

    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return repository.findAll();
    }

    @PostMapping("/submit")
    public String submitQuiz(@RequestBody List<QuizSubmission> submissions) {
        int score = quizService.calculateScore(submissions);
        return "You scored: " + score + " out of " + submissions.size();
    }
}