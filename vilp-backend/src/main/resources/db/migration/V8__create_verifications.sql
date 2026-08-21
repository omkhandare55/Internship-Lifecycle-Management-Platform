-- V8: Create verifications table
-- Source: TRD §15, Blueprint §33

CREATE TABLE IF NOT EXISTS verifications (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Polymorphic: what is being verified?
    entity_type         VARCHAR(50)  NOT NULL,   -- STUDENT | COMPANY | INTERNSHIP | DOCUMENT | OFFER | CERTIFICATE
    entity_id           UUID         NOT NULL,
    verification_type   VARCHAR(100) NOT NULL,
    -- Status machine: PENDING → UNDER_REVIEW → VERIFIED/REJECTED/SUSPENDED
    status              VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    submitted_by        UUID         NOT NULL REFERENCES users(id),
    verified_by         UUID         REFERENCES users(id),
    verification_notes  TEXT,
    rejection_reason    TEXT,
    submitted_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    verified_at         TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_verifications_entity  ON verifications(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status  ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_sub_by  ON verifications(submitted_by);
