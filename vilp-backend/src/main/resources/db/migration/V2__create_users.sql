-- V2: Create users table
-- Source: TRD §12.1, Blueprint §33
-- Supports email/password + Google OAuth authentication

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id                          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email                       VARCHAR(255) NOT NULL UNIQUE,
    password_hash               VARCHAR(255),                           -- NULL for Google-only accounts
    google_subject              VARCHAR(255) UNIQUE,                    -- Google OAuth subject ID
    role_id                     BIGINT       NOT NULL REFERENCES roles(id),
    status                      VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | SUSPENDED | DELETED
    email_verified              BOOLEAN      NOT NULL DEFAULT FALSE,
    verification_token          VARCHAR(255),
    verification_token_expiry   TIMESTAMP WITH TIME ZONE,
    reset_token                 VARCHAR(255),
    reset_token_expiry          TIMESTAMP WITH TIME ZONE,
    failed_login_attempts       INT          NOT NULL DEFAULT 0,
    locked_until                TIMESTAMP WITH TIME ZONE,
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for common query patterns (TRD §41)
CREATE INDEX idx_users_email          ON users(email);
CREATE INDEX idx_users_role_id        ON users(role_id);
CREATE INDEX idx_users_google_subject ON users(google_subject) WHERE google_subject IS NOT NULL;
CREATE INDEX idx_users_status         ON users(status);
CREATE INDEX idx_users_created_at     ON users(created_at);

-- Constraint: at least one of password_hash or google_subject must be set
ALTER TABLE users ADD CONSTRAINT chk_users_auth_method
    CHECK (password_hash IS NOT NULL OR google_subject IS NOT NULL);
