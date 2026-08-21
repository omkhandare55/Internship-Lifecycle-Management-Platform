package com.vilp.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Startup validator that logs warnings for critical configuration issues.
 * Does not block startup — just provides clear diagnostics in logs.
 */
@Component
@Slf4j
public class StartupConfigValidator implements CommandLineRunner {

    @Value("${spring.mail.host:localhost}")
    private String mailHost;

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${app.cors-allowed-origins:}")
    private String corsOrigins;

    @Override
    public void run(String... args) {
        log.info("════════════════════════════════════════════════════════════");
        log.info("  VILP Platform — Startup Configuration Check");
        log.info("════════════════════════════════════════════════════════════");

        // JWT Secret check
        if (jwtSecret.contains("change-this") || jwtSecret.length() < 32) {
            log.error("🔴 INSECURE JWT_SECRET — using default or short value. " +
                      "Set JWT_SECRET env var to a secure random 256-bit base64 key in production.");
        } else {
            log.info("✅ JWT_SECRET configured (length={})", jwtSecret.length());
        }

        // Mail config check
        if ("localhost".equals(mailHost) || mailHost.isBlank()) {
            log.warn("⚠️  MAIL NOT CONFIGURED — email verification & password reset will silently fail. " +
                     "Set MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD environment variables.");
        } else {
            log.info("✅ Mail host configured: {}", mailHost);
        }

        // CORS origins check
        if (corsOrigins.isBlank() || corsOrigins.contains("localhost")) {
            log.warn("⚠️  CORS_ORIGINS includes localhost or is empty: '{}'. " +
                     "Ensure production frontend URL is included.", corsOrigins);
        } else {
            log.info("✅ CORS origins: {}", corsOrigins);
        }

        log.info("════════════════════════════════════════════════════════════");
    }
}
