package com.vilp.config;

import com.vilp.common.util.InputSanitizer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

import java.lang.reflect.Field;
import java.lang.reflect.Type;

/**
 * Global request body sanitization advice.
 *
 * Automatically sanitizes all String fields in @RequestBody DTOs before they reach
 * the controller. Prevents stored XSS without requiring manual sanitization in each service.
 *
 * Targets all controllers under com.vilp package.
 * Skips fields named "password", "token", or "secret" (credentials must not be altered).
 */
@RestControllerAdvice(basePackages = "com.vilp")
@Slf4j
public class InputSanitizationAdvice extends RequestBodyAdviceAdapter {

    private static final java.util.Set<String> SKIP_FIELDS = java.util.Set.of(
            "password", "newPassword", "confirmPassword", "currentPassword",
            "token", "refreshToken", "accessToken", "secret", "otp", "code"
    );

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        // Apply to all request bodies
        return true;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage,
                                MethodParameter parameter, Type targetType,
                                Class<? extends HttpMessageConverter<?>> converterType) {
        sanitizeObject(body);
        return body;
    }

    /**
     * Recursively sanitize all String fields on the object.
     */
    private void sanitizeObject(Object obj) {
        if (obj == null) return;

        Class<?> clazz = obj.getClass();
        // Only sanitize objects from our DTO packages
        if (!clazz.getName().startsWith("com.vilp")) return;

        for (Field field : getAllFields(clazz)) {
            if (!field.canAccess(obj)) {
                field.setAccessible(true);
            }
            try {
                if (field.getType() == String.class) {
                    String fieldName = field.getName();
                    // Never sanitize credentials — they may contain special characters
                    if (SKIP_FIELDS.contains(fieldName)) continue;

                    String value = (String) field.get(obj);
                    if (value != null && !value.isBlank()) {
                        // Use rich-text sanitization for known description fields
                        String sanitized;
                        if ("description".equals(fieldName) || "about".equals(fieldName)
                                || "termsAndConditions".equals(fieldName)) {
                            sanitized = InputSanitizer.sanitizeRichText(value);
                        } else {
                            sanitized = InputSanitizer.sanitize(value);
                        }
                        field.set(obj, sanitized);
                    }
                } else if (field.getType().getName().startsWith("com.vilp")) {
                    // Recurse into nested DTOs
                    Object nested = field.get(obj);
                    if (nested != null) {
                        sanitizeObject(nested);
                    }
                }
            } catch (IllegalAccessException e) {
                log.debug("Could not sanitize field {}.{}: {}", clazz.getSimpleName(),
                        field.getName(), e.getMessage());
            }
        }
    }

    /**
     * Get all declared fields including from superclasses (for inherited DTOs).
     */
    private java.util.List<Field> getAllFields(Class<?> clazz) {
        java.util.List<Field> fields = new java.util.ArrayList<>();
        while (clazz != null && clazz != Object.class) {
            fields.addAll(java.util.Arrays.asList(clazz.getDeclaredFields()));
            clazz = clazz.getSuperclass();
        }
        return fields;
    }
}
