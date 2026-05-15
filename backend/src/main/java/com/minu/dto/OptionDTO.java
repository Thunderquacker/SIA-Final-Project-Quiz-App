package com.minu.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDTO {
    private Long optionId;
    private String optionText;
    private Boolean isCorrect;
    private Integer displayOrder;
}
