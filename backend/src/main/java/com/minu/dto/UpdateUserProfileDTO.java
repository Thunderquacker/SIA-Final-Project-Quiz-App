package com.minu.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserProfileDTO {
    private String username;
    private String email;
    private String bio;
    private String profileImageUrl;
}
