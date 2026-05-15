package com.minu.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {
    private int status;
    private String message;
    private String error;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> validationErrors;

    public static ApiErrorResponse of(int status, String message, String error) {
        return ApiErrorResponse.builder()
                .status(status)
                .message(message)
                .error(error)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ApiErrorResponse of(int status, String message, String error, String path) {
        return ApiErrorResponse.builder()
                .status(status)
                .message(message)
                .error(error)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
}
