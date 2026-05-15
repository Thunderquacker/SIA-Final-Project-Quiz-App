package com.minu.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long questionId;
    private String questionText;
    private Integer displayOrder;
    private List<OptionDTO> options;
}
