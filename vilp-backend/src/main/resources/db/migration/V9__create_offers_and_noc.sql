-- V9: Create offers and noc_requests tables
-- Source: PRD §12, §13, TRD §26, §27, Blueprint §30, §31

CREATE TABLE offers (
    id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id          UUID         NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    internship_id           UUID         NOT NULL REFERENCES internships(id),
    company_id              UUID         NOT NULL REFERENCES companies(id),
    student_id              UUID         NOT NULL REFERENCES students(id),
    stipend                 NUMERIC(10,2),
    start_date              DATE         NOT NULL,
    end_date                DATE         NOT NULL,
    -- State machine: OFFERED -> ACCEPTED | REJECTED | EXPIRED | REVOKED
    status                  VARCHAR(50)  NOT NULL DEFAULT 'OFFERED',
    offer_letter_doc_id     UUID         REFERENCES documents(id),
    acceptance_letter_doc_id UUID        REFERENCES documents(id),
    terms_and_conditions    TEXT,
    expiry_date             TIMESTAMP WITH TIME ZONE,
    response_date           TIMESTAMP WITH TIME ZONE,
    response_notes          TEXT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE noc_requests (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id            UUID         NOT NULL UNIQUE REFERENCES offers(id) ON DELETE CASCADE,
    student_id          UUID         NOT NULL REFERENCES students(id),
    internship_id       UUID         NOT NULL REFERENCES internships(id),
    department_id       BIGINT       REFERENCES departments(id),
    -- State machine: PENDING_REVIEW -> APPROVED | REJECTED
    status              VARCHAR(50)  NOT NULL DEFAULT 'PENDING_REVIEW',
    requested_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    approved_by         UUID         REFERENCES users(id),
    approved_at         TIMESTAMP WITH TIME ZONE,
    rejection_reason    TEXT,
    noc_document_id     UUID         REFERENCES documents(id),
    verification_code   VARCHAR(50)  UNIQUE, -- unique token for NOC validation
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_offers_student_id      ON offers(student_id);
CREATE INDEX idx_offers_company_id      ON offers(company_id);
CREATE INDEX idx_offers_internship_id   ON offers(internship_id);
CREATE INDEX idx_offers_status          ON offers(status);

CREATE INDEX idx_noc_student_id         ON noc_requests(student_id);
CREATE INDEX idx_noc_department_id      ON noc_requests(department_id);
CREATE INDEX idx_noc_status             ON noc_requests(status);
CREATE INDEX idx_noc_verification_code  ON noc_requests(verification_code);
