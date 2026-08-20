-- V1: Create roles table and seed default roles
-- Source: TRD §12.2, Blueprint §33
-- Six roles per PRD §4 and TRD §9

CREATE TABLE roles (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO roles (name, description) VALUES
    ('STUDENT',     'Registered student who can apply for internships'),
    ('COMPANY',     'Company recruiter who can post internships and select candidates'),
    ('MENTOR',      'Faculty mentor assigned to monitor student internship progress'),
    ('TNP_OFFICER', 'Training & Placement Officer who verifies students, companies and internships'),
    ('TNP_HEAD',    'T&P Head with oversight over T&P operations and analytics'),
    ('SUPER_ADMIN', 'Super administrator with full system access');
