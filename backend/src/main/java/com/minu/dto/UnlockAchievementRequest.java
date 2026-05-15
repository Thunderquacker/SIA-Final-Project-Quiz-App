package com.minu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnlockAchievementRequest {
    @NotBlank(message = "Achievement title is required")
    private String title;

    @NotBlank(message = "Achievement description is required")
    private String description;

    private String badgeUrl;

    @NotBlank(message = "Achievement type is required")
    private String type;
}
