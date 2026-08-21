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
 * and enforces PgBouncer-safe connection parameters.
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

                // Preserve original query parameters and append PgBouncer-safe defaults
                String query = uri.getRawQuery();
                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                        .append(host).append(":").append(port).append("/").append(path);

                // Build query parameters — preserve originals, ensure critical ones exist
                StringBuilder params = new StringBuilder();
                if (query != null && !query.isBlank()) {
                    params.append(query);
                }
                if (!params.toString().contains("sslmode")) {
                    if (params.length() > 0) params.append("&");
                    params.append("sslmode=require");
                }
                if (!params.toString().contains("prepareThreshold")) {
                    if (params.length() > 0) params.append("&");
                    params.append("prepareThreshold=0");
                }
                if (params.length() > 0) {
                    jdbcUrl.append("?").append(params);
                }

                url = jdbcUrl.toString();
                log.info("Auto-formatted cloud PostgreSQL connection URL for host: {}:{}", host, port);
            } else if (url != null && url.startsWith("jdbc:postgresql://")) {
                // Standard JDBC URL — ensure prepareThreshold=0 is present
                if (!url.contains("prepareThreshold")) {
                    url += (url.contains("?") ? "&" : "?") + "prepareThreshold=0";
                }
            }

            config.setJdbcUrl(url);
            if (username != null && !username.isBlank()) {
                config.setUsername(username);
            }
            if (password != null && !password.isBlank()) {
                config.setPassword(password);
            }

            // PgBouncer-compatible pool settings (small pool for free-tier Supabase/Render)
            config.setMaximumPoolSize(3);
            config.setMinimumIdle(1);
            config.setConnectionTimeout(30000);
            config.setIdleTimeout(30000);
            config.setMaxLifetime(120000);
            config.setLeakDetectionThreshold(60000);
            config.setConnectionTestQuery("SELECT 1");

            // Critical: disable named prepared statements for PgBouncer transaction mode
            config.addDataSourceProperty("prepareThreshold", "0");
            config.addDataSourceProperty("preparedStatementCacheQueries", "0");
            config.addDataSourceProperty("tcpKeepAlive", "true");

            return new HikariDataSource(config);
        } catch (Exception e) {
            log.warn("Dynamic database URI parser fallback: {}", e.getMessage());
            config.setJdbcUrl(rawUrl);
            config.setUsername(defaultUsername);
            config.setPassword(defaultPassword);
            config.setMaximumPoolSize(3);
            config.addDataSourceProperty("prepareThreshold", "0");
            config.addDataSourceProperty("preparedStatementCacheQueries", "0");
            return new HikariDataSource(config);
        }
    }
}
