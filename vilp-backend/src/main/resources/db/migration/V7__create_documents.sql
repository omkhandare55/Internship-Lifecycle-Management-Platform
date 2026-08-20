-- V7: Create documents table
-- Source: TRD §16, §17, Blueprint §33
-- Note: Actual files stored in object storage (S3-compatible). DB stores metadata only.

CREATE TABLE documents (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Polymorphic entity reference
    entity_type         VARCHAR(50)  NOT NULL,   -- STUDENT | COMPANY | INTERNSHIP | APPLICATION | OFFER
    entity_id           UUID         NOT NULL,
    -- Document classification (TRD §17)
    document_type       VARCHAR(100) NOT NULL,   -- RESUME | OFFER_LETTER | etc.
    -- Object storage metadata
    storage_key         VARCHAR(500) NOT NULL,   -- path in object storage
    original_filename   VARCHAR(255) NOT NULL,
    mime_type           VARCHAR(100) NOT NULL,
    size                BIGINT       NOT NULL,   -- bytes
    -- Ownership and review
    uploaded_by         UUID         NOT NULL REFERENCES users(id),
    -- Status state machine: UPLOADED → UNDER_REVIEW → VERIFIED/REJECTED/EXPIRED
    status              VARCHAR(50)  NOT NULL DEFAULT 'UPLOADED',
    verified_by         UUID         REFERENCES users(id),
    verification_reason TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_entity       ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_type         ON documents(document_type);
CREATE INDEX idx_documents_uploaded_by  ON documents(uploaded_by);
CREATE INDEX idx_documents_status       ON documents(status);
