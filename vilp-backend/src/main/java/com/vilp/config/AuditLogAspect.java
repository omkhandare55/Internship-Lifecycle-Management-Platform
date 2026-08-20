package com.vilp.config;

import com.vilp.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * AOP aspect that automatically records audit log entries for all state-changing
 * service method invocations. This eliminates the need to manually wire
 * auditLogService.recordAction() into every domain service.
 *
 * Captures: userId, action name, entity type (derived from service class), and
 * entity ID (from UUID method arguments if present).
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogAspect {

    private final AuditLogService auditLogService;

    /**
     * After any public method in a *Service class within com.vilp completes successfully,
     * log an audit entry if the method is NOT a read-only getter/list/search.
     */
    @AfterReturning("execution(public * com.vilp..service.*Service.*(..))")
    public void auditServiceCall(JoinPoint jp) {
        String methodName = jp.getSignature().getName();

        // Skip read-only methods
        if (methodName.startsWith("get") || methodName.startsWith("list")
                || methodName.startsWith("search") || methodName.startsWith("find")
                || methodName.startsWith("count") || methodName.startsWith("calculate")
                || methodName.equals("recordAction")) { // Prevent recursive audit logging
            return;
        }

        try {
            UUID userId = getCurrentUserId();
            String email = getCurrentEmail();
            String entityType = extractEntityType(jp.getTarget().getClass().getSimpleName());
            String entityId = extractEntityId(jp.getArgs());
            String action = methodName.toUpperCase();

            auditLogService.recordAction(userId, email, action, entityType, entityId, null,
                    "Auto: " + jp.getSignature().toShortString());
        } catch (Exception e) {
            log.debug("Audit logging skipped (non-critical): {}", e.getMessage());
        }
    }

    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails ud) {
            try {
                return UUID.fromString(ud.getUsername());
            } catch (IllegalArgumentException ignored) {}
        }
        return null;
    }

    private String getCurrentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails ud) {
            return ud.getUsername();
        }
        return null;
    }

    /**
     * Extract entity type from service class name.
     * e.g. InternshipService -> INTERNSHIP, OfferService -> OFFER
     */
    private String extractEntityType(String className) {
        return className.replace("Service", "").toUpperCase();
    }

    /**
     * Find first UUID argument (likely the entity ID or user ID).
     */
    private String extractEntityId(Object[] args) {
        for (Object arg : args) {
            if (arg instanceof UUID uuid) {
                return uuid.toString();
            }
        }
        return null;
    }
}
