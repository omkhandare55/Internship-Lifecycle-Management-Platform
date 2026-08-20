package com.vilp.exception;

import lombok.Getter;

/**
 * Auth-specific exception with an error code.
 * Handled by GlobalExceptionHandler with appropriate HTTP status mapping.
 */
@Getter
public class AuthException extends RuntimeException {
    private final String code;

    public AuthException(String code, String message) {
        super(message);
        this.code = code;
    }
}
