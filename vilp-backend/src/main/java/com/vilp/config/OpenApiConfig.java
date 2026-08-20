package com.vilp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI Configuration
 * Source: TRD §3 (API Documentation: OpenAPI / Swagger)
 * Access: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vilpOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()
                .info(new Info()
                        .title("VILP API")
                        .description("Verified Internship Lifecycle Platform REST API\n\n" +
                                "Architecture: Modular Monolith | Stack: Spring Boot 3 + PostgreSQL + JWT\n\n" +
                                "Use Bearer token authentication. Obtain token via POST /api/auth/login")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("VILP Team")
                                .email("team@vilp.dev")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
