-- V11: Create certificates and ppo_records tables
-- Source: PRD §15, §16, TRD §25, §26, §30, Blueprint §33

CREATE TABLE IF NOT EXISTS certificates (
    id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id           UUID         NOT NULL REFERENCES internships(id),
    company_id              UUID         NOT NULL REFERENCES companies(id),
    certificate_number      VARCHAR(50)  NOT NULL UNIQUE, -- CERT-2026-XXXXX
    issue_date              DATE         NOT NULL DEFAULT CURRENT_DATE,
    grade                   VARCHAR(10)  NOT NULL DEFAULT 'A',
    total_hours_completed   INT          NOT NULL DEFAULT 240,
    status                  VARCHAR(50)  NOT NULL DEFAULT 'ISSUED', -- ISSUED | REVOKED
    verification_hash       VARCHAR(255) NOT NULL, -- SHA-256 integrity hash
    document_id             UUID         REFERENCES documents(id),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (student_id, internship_id)
);

CREATE TABLE IF NOT EXISTS ppo_records (
    id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    company_id              UUID         NOT NULL REFERENCES companies(id),
    internship_id           UUID         NOT NULL REFERENCES internships(id),
    designation             VARCHAR(100) NOT NULL,
    ctc_annual              NUMERIC(12,2) NOT NULL, -- Annual Cost to Company
    joining_date            DATE,
    location                VARCHAR(100),
    status                  VARCHAR(50)  NOT NULL DEFAULT 'OFFERED', -- OFFERED | ACCEPTED | DECLINED | JOINED
    offer_letter_doc_id     UUID         REFERENCES documents(id),
    terms                   TEXT,
    accepted_at             TIMESTAMP WITH TIME ZONE,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (student_id, company_id, internship_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certificates_student_id           ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_internship_id        ON certificates(internship_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number   ON certificates(certificate_number);

CREATE INDEX IF NOT EXISTS idx_ppo_student_id                    ON ppo_records(student_id);
CREATE INDEX IF NOT EXISTS idx_ppo_company_id                    ON ppo_records(company_id);
CREATE INDEX IF NOT EXISTS idx_ppo_status                        ON ppo_records(status);
