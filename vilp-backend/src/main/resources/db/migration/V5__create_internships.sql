-- V5: Create internships tables
-- Source: TRD §12.5, §13, Blueprint §33

CREATE TABLE IF NOT EXISTS internships (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id            UUID         NOT NULL REFERENCES companies(id),
    title                 VARCHAR(255) NOT NULL,
    description           TEXT,
    location              VARCHAR(255),
    mode                  VARCHAR(50)  NOT NULL,    -- REMOTE | ONSITE | HYBRID
    duration              INT,                      -- weeks
    start_date            DATE,
    end_date              DATE,
    stipend               NUMERIC(10,2),
    vacancies             INT          NOT NULL DEFAULT 1,
    application_deadline  TIMESTAMP WITH TIME ZONE,
    -- Status state machine per TRD §26
    status                VARCHAR(50)  NOT NULL DEFAULT 'DRAFT',
    verification_status   VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    unique_id             VARCHAR(30)  UNIQUE,      -- format: INT-2026-00452
    created_by            UUID         REFERENCES users(id),
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Eligibility requirements per internship (TRD §13)
CREATE TABLE IF NOT EXISTS internship_requirements (
    id                      BIGSERIAL    PRIMARY KEY,
    internship_id           UUID         NOT NULL UNIQUE REFERENCES internships(id) ON DELETE CASCADE,
    minimum_cgpa            NUMERIC(4,2) DEFAULT 0,
    maximum_backlogs        INT          DEFAULT 999,
    department              VARCHAR(100),    -- NULL = all departments
    branch                  VARCHAR(100),    -- NULL = all branches
    passing_year            INT,
    required_experience     INT          DEFAULT 0,  -- months
    required_certifications TEXT                     -- JSON array of cert names
);

-- M2M: internships ↔ skills (TRD §13)
CREATE TABLE IF NOT EXISTS internship_skills (
    internship_id   UUID    NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    skill_id        BIGINT  NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_mandatory    BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (internship_id, skill_id)
);

-- Sequence for unique ID generation
CREATE SEQUENCE IF NOT EXISTS internship_seq START 1;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_internships_company_id         ON internships(company_id);
CREATE INDEX IF NOT EXISTS idx_internships_status             ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_verification       ON internships(verification_status);
CREATE INDEX IF NOT EXISTS idx_internships_deadline           ON internships(application_deadline);
CREATE INDEX IF NOT EXISTS idx_internships_mode               ON internships(mode);
