-- V6: Create applications table
-- Source: TRD §14, Blueprint §33

CREATE TABLE IF NOT EXISTS applications (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id     UUID         NOT NULL REFERENCES internships(id),
    student_id        UUID         NOT NULL REFERENCES students(id),
    -- State machine: APPLIED → SHORTLISTED → INTERVIEW → SELECTED/REJECTED/WITHDRAWN
    status            VARCHAR(50)  NOT NULL DEFAULT 'APPLIED',
    cover_letter      TEXT,
    applied_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    withdrawn_at      TIMESTAMP WITH TIME ZONE,
    rejection_reason  TEXT,

    -- One student can only apply once to an internship (TRD §36)
    UNIQUE (student_id, internship_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id    ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status        ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at    ON applications(applied_at);
