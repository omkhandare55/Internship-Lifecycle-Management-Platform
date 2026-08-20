package com.vilp.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Universal Cloud PostgreSQL DataSource Configuration
 * Automatically parses any URL format (Render, Heroku, Supabase, standard JDBC)
 */
@Configuration
@Slf4j
public class DataSourceConfig {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/vilpdb}")
    private String rawUrl;

    @Value("${spring.datasource.username:vilpuser}")
    private String defaultUsername;

    @Value("${spring.datasource.password:vilppassword}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        try {
            String url = rawUrl;
            String username = defaultUsername;
            String password = defaultPassword;

            // Handle Render / Heroku / Supabase URLs: postgres://user:pass@host:port/db
            // or jdbc:postgresql://user:pass@host:port/db
            if (url != null && (url.contains("@") || url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
                String cleanUrl = url;
                if (cleanUrl.startsWith("jdbc:")) {
                    cleanUrl = cleanUrl.substring(5);
                }
                if (cleanUrl.startsWith("postgres://")) {
                    cleanUrl = "postgresql://" + cleanUrl.substring("postgres://".length());
                }

                URI uri = new URI(cleanUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                if (path != null && path.startsWith("/")) {
                    path = path.substring(1);
                }

                url = "jdbc:postgresql://" + host + ":" + port + "/" + path;
                log.info("Auto-formatted cloud PostgreSQL connection URL for host: {}:{}", host, port);
            }

            config.setJdbcUrl(url);
            if (username != null && !username.isBlank()) {
                config.setUsername(username);
            }
            if (password != null && !password.isBlank()) {
                config.setPassword(password);
            }

            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(600000);
            config.setMaxLifetime(1800000);

            return new HikariDataSource(config);
        } catch (Exception e) {
            log.warn("Dynamic database URI parser fallback: {}", e.getMessage());
            config.setJdbcUrl(rawUrl);
            config.setUsername(defaultUsername);
            config.setPassword(defaultPassword);
            return new HikariDataSource(config);
        }
    }
}
