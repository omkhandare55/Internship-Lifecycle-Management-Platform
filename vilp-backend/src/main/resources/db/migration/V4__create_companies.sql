-- V4: Create companies table
-- Source: TRD §12.4, Blueprint §33

CREATE TABLE companies (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name                  VARCHAR(255) NOT NULL,
    description           TEXT,
    website               VARCHAR(500),
    industry              VARCHAR(100),
    size                  VARCHAR(50),      -- STARTUP | SMALL | MEDIUM | LARGE | ENTERPRISE
    headquarters          VARCHAR(255),
    contact_email         VARCHAR(255),
    contact_phone         VARCHAR(20),
    contact_person_name   VARCHAR(255),
    logo_document_id      UUID,             -- FK added after documents table
    -- Verification state: PENDING → UNDER_REVIEW → VERIFIED/REJECTED/SUSPENDED
    verification_status   VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    verification_date     TIMESTAMP WITH TIME ZONE,
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_user_id          ON companies(user_id);
CREATE INDEX idx_companies_verification     ON companies(verification_status);
CREATE INDEX idx_companies_name             ON companies(name);
