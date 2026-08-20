-- V13: Seed demo accounts for all roles
-- Password for all demo accounts: Password@123
-- Argon2id hash: $argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s

-- 1. Student Demo User
INSERT INTO users (id, email, password_hash, role_id, status, email_verified)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'student@vilp.edu',
    '$argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s',
    1, -- STUDENT
    'ACTIVE',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 2. Company Recruiter Demo User
INSERT INTO users (id, email, password_hash, role_id, status, email_verified)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'recruiter@google.com',
    '$argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s',
    2, -- COMPANY
    'ACTIVE',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 3. Faculty Mentor Demo User
INSERT INTO users (id, email, password_hash, role_id, status, email_verified)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'mentor@vilp.edu',
    '$argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s',
    3, -- MENTOR
    'ACTIVE',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 4. T&P Officer Demo User
INSERT INTO users (id, email, password_hash, role_id, status, email_verified)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    'tnp.officer@vilp.edu',
    '$argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s',
    4, -- TNP_OFFICER
    'ACTIVE',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 5. T&P Head Demo User
INSERT INTO users (id, email, password_hash, role_id, status, email_verified)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    'tnp.head@vilp.edu',
    '$argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s',
    5, -- TNP_HEAD
    'ACTIVE',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 6. Super Admin Demo User
INSERT INTO users (id, email, password_hash, role_id, status, email_verified)
VALUES (
    '66666666-6666-6666-6666-666666666666',
    'admin@vilp.edu',
    '$argon2id$v=19$m=16384,t=2,p=1$u1/kU1VlQc9T62iY+dGg7A$81c1kK34Yd+q604K48rW6x71Qd047q0y0JpX3Qc6W6s',
    6, -- SUPER_ADMIN
    'ACTIVE',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Seed Sample Student Profile
INSERT INTO students (id, user_id, student_number, full_name, department_id, branch, semester, cgpa, backlogs, passing_year, verification_status, profile_completion)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '2022CS1045',
    'Aarav Sharma',
    1, -- Computer Science & Engineering
    'Computer Science',
    6,
    8.85,
    0,
    2026,
    'VERIFIED',
    95
) ON CONFLICT (student_number) DO NOTHING;

-- Seed Sample Company Profile
INSERT INTO companies (id, user_id, name, description, website, industry, size, headquarters, contact_email, contact_person_name, verification_status)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'Google Cloud India',
    'Global enterprise cloud infrastructure, search, AI, and developer platform.',
    'https://cloud.google.com',
    'Information Technology',
    '10,000+',
    'Bangalore, Karnataka, India',
    'recruiter@google.com',
    'Vikram Mehta',
    'VERIFIED'
) ON CONFLICT DO NOTHING;
