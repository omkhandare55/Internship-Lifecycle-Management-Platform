-- V14: Performance indexes for frequently queried columns

CREATE INDEX IF NOT EXISTS idx_applications_student_status ON applications(student_id, status);
CREATE INDEX IF NOT EXISTS idx_logbooks_student_id ON weekly_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_logbooks_student_status ON weekly_reports(student_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_offers_student_status ON offers(student_id, status);
CREATE INDEX IF NOT EXISTS idx_internships_status_deadline ON internships(status, application_deadline);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(lower(email));
