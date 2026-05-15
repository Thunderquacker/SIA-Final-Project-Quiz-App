package com.minu.service;

import com.minu.model.*;
import com.minu.repository.*;
import com.minu.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final UserRepository userRepository;

    public QuizDTO createQuiz(Long userId, CreateQuizRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create Quiz
        Quiz quiz = Quiz.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .category(request.getCategory())
            .difficulty(request.getDifficulty())
            .user(user)
            .build();

        quiz = quizRepository.save(quiz);

        // Create Questions and Options
        List<Question> questions = new java.util.ArrayList<>();
        if (request.getQuestions() != null) {
            for (CreateQuizRequest.QuestionRequest qReq : request.getQuestions()) {
                Question question = Question.builder()
                    .questionText(qReq.getQuestionText())
                    .displayOrder(qReq.getDisplayOrder() != null ? qReq.getDisplayOrder() : 0)
                    .quiz(quiz)
                    .build();

                question = questionRepository.save(question);

                // Create Options
                List<Option> options = new java.util.ArrayList<>();
                if (qReq.getOptions() != null) {
                    for (CreateQuizRequest.OptionRequest oReq : qReq.getOptions()) {
                        Option option = Option.builder()
                            .optionText(oReq.getOptionText())
                            .isCorrect(oReq.getIsCorrect() != null ? oReq.getIsCorrect() : false)
                            .displayOrder(oReq.getDisplayOrder() != null ? oReq.getDisplayOrder() : 0)
                            .question(question)
                            .build();

                        options.add(optionRepository.save(option));
                    }
                }

                question.setOptions(options);
                questions.add(question);
            }
        }

        quiz.setQuestions(questions);

        return mapToDTO(quiz, user);
    }

    public QuizDTO getQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        return mapToDTO(quiz, quiz.getUser());
    }

    public List<QuizDTO> getQuizzesByUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Quiz> quizzes = quizRepository.findByUserOrderByCreatedAtDesc(user);
        return quizzes.stream()
            .map(quiz -> mapToDTO(quiz, user))
            .collect(Collectors.toList());
    }

    public List<QuizDTO> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return quizzes.stream()
            .map(quiz -> mapToDTO(quiz, quiz.getUser()))
            .collect(Collectors.toList());
    }

    public void deleteQuiz(Long quizId, Long userId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        if (!quiz.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to delete this quiz");
        }

        quizRepository.delete(quiz);
    }

    private QuizDTO mapToDTO(Quiz quiz, User user) {
        List<QuestionDTO> questionDTOs = quiz.getQuestions() != null 
            ? quiz.getQuestions().stream()
                .map(q -> QuestionDTO.builder()
                    .questionId(q.getQuestionId())
                    .questionText(q.getQuestionText())
                    .displayOrder(q.getDisplayOrder())
                    .options(q.getOptions() != null 
                        ? q.getOptions().stream()
                            .map(o -> OptionDTO.builder()
                                .optionId(o.getOptionId())
                                .optionText(o.getOptionText())
                                .isCorrect(o.getIsCorrect())
                                .displayOrder(o.getDisplayOrder())
                                .build())
                            .collect(Collectors.toList())
                        : null)
                    .build())
                .collect(Collectors.toList())
            : java.util.Collections.emptyList();

        return QuizDTO.builder()
            .quizId(quiz.getQuizId())
            .title(quiz.getTitle())
            .description(quiz.getDescription())
            .category(quiz.getCategory())
            .difficulty(quiz.getDifficulty())
            .userId(user.getUserId())
            .username(user.getUsername())
            .questions(questionDTOs)
            .questionCount(questionDTOs.size())
            .createdAt(quiz.getCreatedAt())
            .updatedAt(quiz.getUpdatedAt())
            .build();
    }
}
