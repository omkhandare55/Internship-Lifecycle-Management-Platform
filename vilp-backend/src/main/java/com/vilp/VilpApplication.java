package com.vilp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Verified Internship Lifecycle Platform - Main Application Entry Point
 * Architecture: Modular Monolith (TRD §5)
 * Stack: Java 21 + Spring Boot 3 + PostgreSQL + JWT (TRD §3)
 */
@SpringBootApplication
public class VilpApplication {
    public static void main(String[] args) {
        SpringApplication.run(VilpApplication.class, args);
    }
}
