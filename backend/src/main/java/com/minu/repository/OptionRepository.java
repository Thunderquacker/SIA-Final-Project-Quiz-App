package com.minu.repository;

import com.minu.model.Option;
import com.minu.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestionOrderByDisplayOrder(Question question);

    List<Option> findByQuestion(Question question);

    long countByQuestion(Question question);
}
