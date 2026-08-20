-- V15: Add soft-delete support to key entities
-- Allows logical deletion with full audit trail

ALTER TABLE internships  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE offers       ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Partial indexes: exclude soft-deleted rows from normal queries
CREATE INDEX IF NOT EXISTS idx_internships_active
    ON internships(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_applications_active
    ON applications(student_id, status) WHERE deleted_at IS NULL;
