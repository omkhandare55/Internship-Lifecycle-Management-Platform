package com.vilp.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IP-based rate limiting filter using Bucket4j.
 *
 * Limits:
 *   - Auth endpoints (/api/auth/login, /api/auth/register): 10 requests / minute per IP
 *   - All other API endpoints: 120 requests / minute per IP
 *
 * Returns HTTP 429 with Retry-After header on breach.
 */
@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    // Separate buckets per IP address for auth vs. general API
    private final Map<String, Bucket> authBuckets    = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

    private static final int AUTH_REQUESTS_PER_MINUTE    = 10;
    private static final int GENERAL_REQUESTS_PER_MINUTE = 120;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String ip = getClientIp(request);
        String path = request.getRequestURI();

        // Skip rate limiting for non-API paths (static assets, actuator health)
        if (!path.startsWith("/api/") || path.equals("/api/actuator/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean isAuthPath = path.startsWith("/api/auth/login")
                || path.startsWith("/api/auth/register")
                || path.startsWith("/api/auth/forgot-password");

        Bucket bucket = isAuthPath
                ? authBuckets.computeIfAbsent(ip, this::newAuthBucket)
                : generalBuckets.computeIfAbsent(ip, this::newGeneralBucket);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP {} on path {}", ip, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"success\":false,\"errorCode\":\"RATE_LIMIT_EXCEEDED\"," +
                    "\"message\":\"Too many requests. Please wait 60 seconds before retrying.\"}");
        }
    }

    private Bucket newAuthBucket(String ip) {
        Bandwidth limit = Bandwidth.classic(
                AUTH_REQUESTS_PER_MINUTE,
                Refill.greedy(AUTH_REQUESTS_PER_MINUTE, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket newGeneralBucket(String ip) {
        Bandwidth limit = Bandwidth.classic(
                GENERAL_REQUESTS_PER_MINUTE,
                Refill.greedy(GENERAL_REQUESTS_PER_MINUTE, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIp(HttpServletRequest request) {
        // Handle reverse proxy headers (X-Forwarded-For, X-Real-IP)
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
