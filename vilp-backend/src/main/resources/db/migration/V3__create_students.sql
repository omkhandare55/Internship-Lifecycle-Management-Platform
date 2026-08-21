-- V3: Create departments and students tables
-- Source: TRD §12.3, Blueprint §33

CREATE TABLE IF NOT EXISTS departments (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed departments (adjust per institution)
INSERT INTO departments (name, code) VALUES
    ('Computer Science Engineering',       'CSE'),
    ('Information Technology',             'IT'),
    ('Electronics & Communication Engg',   'ECE'),
    ('Electrical Engineering',             'EE'),
    ('Mechanical Engineering',             'ME'),
    ('Civil Engineering',                  'CE'),
    ('Chemical Engineering',               'CHE'),
    ('Biotechnology',                      'BT'),
    ('Master of Computer Applications',    'MCA'),
    ('Master of Business Administration',  'MBA')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS students (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    student_number        VARCHAR(50)  NOT NULL UNIQUE,
    full_name             VARCHAR(255) NOT NULL,
    department_id         BIGINT       REFERENCES departments(id),
    branch                VARCHAR(100),
    semester              INT,
    cgpa                  NUMERIC(4,2) CHECK (cgpa >= 0 AND cgpa <= 10),
    backlogs              INT          NOT NULL DEFAULT 0,
    passing_year          INT,
    phone                 VARCHAR(20),
    linkedin_url          VARCHAR(500),
    portfolio_url         VARCHAR(500),
    about                 TEXT,
    -- Verification state machine: REGISTERED → DOCUMENT_SUBMITTED → UNDER_REVIEW → VERIFIED/REJECTED
    verification_status   VARCHAR(50)  NOT NULL DEFAULT 'REGISTERED',
    profile_completion    INT          NOT NULL DEFAULT 0 CHECK (profile_completion BETWEEN 0 AND 100),
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS student_skills (
    student_id  UUID    NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_id    BIGINT  NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level       VARCHAR(50) DEFAULT 'BEGINNER',   -- BEGINNER | INTERMEDIATE | ADVANCED
    PRIMARY KEY (student_id, skill_id)
);

CREATE TABLE IF NOT EXISTS certifications (
    id              BIGSERIAL    PRIMARY KEY,
    student_id      UUID         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    issuer          VARCHAR(255),
    issued_date     DATE,
    expiry_date     DATE,
    credential_url  VARCHAR(500),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id          ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_number   ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_students_department_id    ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_verification     ON students(verification_status);
CREATE INDEX IF NOT EXISTS idx_students_passing_year     ON students(passing_year);
CREATE INDEX IF NOT EXISTS idx_students_cgpa             ON students(cgpa);

-- Seed common skills
INSERT INTO skills (name, category) VALUES
    ('Java', 'Programming'), ('Python', 'Programming'), ('JavaScript', 'Programming'),
    ('TypeScript', 'Programming'), ('C++', 'Programming'), ('C', 'Programming'),
    ('Spring Boot', 'Framework'), ('React', 'Framework'), ('Angular', 'Framework'),
    ('Node.js', 'Framework'), ('Django', 'Framework'), ('FastAPI', 'Framework'),
    ('PostgreSQL', 'Database'), ('MySQL', 'Database'), ('MongoDB', 'Database'),
    ('Redis', 'Database'), ('Docker', 'DevOps'), ('Kubernetes', 'DevOps'),
    ('Git', 'Tools'), ('Linux', 'Tools'), ('AWS', 'Cloud'), ('Azure', 'Cloud'),
    ('Machine Learning', 'AI/ML'), ('Deep Learning', 'AI/ML'), ('SQL', 'Database')
ON CONFLICT (name) DO NOTHING;
