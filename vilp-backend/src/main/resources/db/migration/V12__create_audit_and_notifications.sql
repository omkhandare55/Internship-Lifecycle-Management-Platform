-- V12: Create audit_logs and notifications tables
-- Source: TRD §28, §31, Blueprint §34, §35

CREATE TABLE audit_logs (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         REFERENCES users(id),
    user_email      VARCHAR(255),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       VARCHAR(50),
    ip_address      VARCHAR(50),
    details         TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    message         TEXT         NOT NULL,
    type            VARCHAR(50)  NOT NULL DEFAULT 'INFO', -- INFO | SUCCESS | WARNING | ACTION_REQUIRED
    is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
    target_url      VARCHAR(255),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id      ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action       ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at   ON audit_logs(created_at DESC);

CREATE INDEX idx_notifications_user_id   ON notifications(user_id);
CREATE INDEX idx_notifications_is_read   ON notifications(is_read);
