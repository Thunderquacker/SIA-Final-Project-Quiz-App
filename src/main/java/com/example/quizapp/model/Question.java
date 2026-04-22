package com.example.quizapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "question") // Explicitly set the table name
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text") // Match this exactly to your SQL
    private String questionText;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "correct_answer")
    private String correctAnswer;

    // Getters and Setters...
    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public Long getId() {
        return id;
    }
}