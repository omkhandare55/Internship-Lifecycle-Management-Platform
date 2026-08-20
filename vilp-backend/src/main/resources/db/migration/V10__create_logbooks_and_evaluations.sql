-- V10: Create weekly_reports (logbooks) and evaluations tables
-- Source: PRD §14, §15, TRD §17, §26, Blueprint §32

CREATE TABLE weekly_reports (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id       UUID         NOT NULL REFERENCES internships(id),
    week_number         INT          NOT NULL,
    start_date          DATE         NOT NULL,
    end_date            DATE         NOT NULL,
    hours_worked        INT          NOT NULL DEFAULT 40,
    tasks_summary       TEXT         NOT NULL,
    skills_applied      TEXT,
    challenges_faced    TEXT,
    learnings           TEXT,
    -- State machine: SUBMITTED -> APPROVED | REVISIONS_REQUESTED | REJECTED
    status              VARCHAR(50)  NOT NULL DEFAULT 'SUBMITTED',
    mentor_feedback     TEXT,
    rating              INT          CHECK (rating BETWEEN 1 AND 5),
    reviewer_id         UUID         REFERENCES users(id),
    reviewed_at         TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (student_id, internship_id, week_number)
);

CREATE TABLE evaluations (
    id                          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id               UUID         NOT NULL REFERENCES internships(id),
    student_id                  UUID         NOT NULL REFERENCES students(id),
    evaluator_id                UUID         NOT NULL REFERENCES users(id),
    evaluator_type              VARCHAR(50)  NOT NULL, -- MENTOR | COMPANY
    evaluation_type             VARCHAR(50)  NOT NULL, -- MIDTERM | FINAL
    technical_skills_rating     INT          NOT NULL CHECK (technical_skills_rating BETWEEN 1 AND 5),
    communication_rating        INT          NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    punctuality_rating          INT          NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
    initiative_rating           INT          NOT NULL CHECK (initiative_rating BETWEEN 1 AND 5),
    overall_performance_rating  INT          NOT NULL CHECK (overall_performance_rating BETWEEN 1 AND 5),
    remarks                     TEXT,
    ppo_recommended             BOOLEAN      DEFAULT FALSE,
    ppo_terms                   TEXT,
    status                      VARCHAR(50)  NOT NULL DEFAULT 'SUBMITTED',
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (internship_id, student_id, evaluator_type, evaluation_type)
);

-- Indexes
CREATE INDEX idx_weekly_reports_student     ON weekly_reports(student_id);
CREATE INDEX idx_weekly_reports_internship  ON weekly_reports(internship_id);
CREATE INDEX idx_weekly_reports_status      ON weekly_reports(status);

CREATE INDEX idx_evaluations_student        ON evaluations(student_id);
CREATE INDEX idx_evaluations_internship     ON evaluations(internship_id);
CREATE INDEX idx_evaluations_type           ON evaluations(evaluation_type);
