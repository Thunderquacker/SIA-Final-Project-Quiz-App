package com.minu.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Minu Quiz Backend API")
                        .version("1.0.0")
                        .description("Comprehensive Quiz Application Backend API with JWT Authentication, User Management, and Achievement Tracking")
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@minuquiz.com")))
                .servers(Arrays.asList(
                        new Server().url("http://localhost:8082").description("Local Development Server"),
                        new Server().url("http://localhost:8083").description("Alternative Port"),
                        new Server().url("https://api.minuquiz.com").description("Production Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token")));
    }
}
