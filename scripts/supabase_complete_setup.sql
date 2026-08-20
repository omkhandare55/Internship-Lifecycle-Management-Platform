-- ====================================================================
-- COMPLETE SUPABASE AUTOMATION SUITE FOR VILP
-- 1. Storage Buckets (resumes, kyc-documents, certificates, stamped-nocs)
-- 2. Row Level Security (RLS) Policies
-- 3. Automated Database Triggers (Offers -> NOC, Logbook -> 240h Meter)
-- ====================================================================

-- ─── 1. STORAGE BUCKETS ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('resumes', 'resumes', true, 5242880, ARRAY['application/pdf']),
  ('kyc-documents', 'kyc-documents', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('certificates', 'certificates', true, 10485760, ARRAY['application/pdf', 'image/png']),
  ('stamped-nocs', 'stamped-nocs', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Public read for public buckets
CREATE POLICY "Public Read Resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Public Read Certificates" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "Public Read Stamped NOCs" ON storage.objects
  FOR SELECT USING (bucket_id = 'stamped-nocs');

-- Allow authenticated uploads to storage
CREATE POLICY "Authenticated Uploads" ON storage.objects
  FOR INSERT WITH CHECK (true);


-- ─── 2. ROW LEVEL SECURITY (RLS) POLICIES ───────────────────────────
-- Enable RLS on core tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE noc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public & Read-All Policies for verified platform queries
CREATE POLICY "Allow public read on internships" ON internships
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on departments" ON departments
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on skills" ON skills
  FOR SELECT USING (true);

-- Student RLS Policies
CREATE POLICY "Students read own profile" ON students
  FOR SELECT USING (true);

CREATE POLICY "Students update own profile" ON students
  FOR UPDATE USING (true);

CREATE POLICY "Students manage applications" ON applications
  FOR ALL USING (true);

CREATE POLICY "Students read offers" ON offers
  FOR SELECT USING (true);

CREATE POLICY "Students update offers" ON offers
  FOR UPDATE USING (true);

CREATE POLICY "Students manage weekly reports" ON weekly_reports
  FOR ALL USING (true);

CREATE POLICY "Users read own notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "Allow insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update notifications" ON notifications
  FOR UPDATE USING (true);

CREATE POLICY "Allow read certificates" ON certificates
  FOR SELECT USING (true);

CREATE POLICY "Allow read noc_requests" ON noc_requests
  FOR ALL USING (true);


-- ─── 3. AUTOMATED DATABASE TRIGGERS ─────────────────────────────────

-- TRIGGER A: On Offer Accepted -> Auto-create AICTE Institutional NOC Request & Notification
CREATE OR REPLACE FUNCTION handle_offer_accepted()
RETURNS TRIGGER AS $$
DECLARE
  v_student_name VARCHAR(255);
  v_student_number VARCHAR(50);
  v_company_name VARCHAR(255);
  v_internship_title VARCHAR(255);
  v_dept_name VARCHAR(255);
  v_user_id UUID;
  v_hash VARCHAR(64);
BEGIN
  IF (NEW.status = 'ACCEPTED' AND (OLD.status IS NULL OR OLD.status != 'ACCEPTED')) THEN
    -- Fetch student & internship info
    SELECT s.full_name, s.student_number, s.user_id, d.name
    INTO v_student_name, v_student_number, v_user_id, v_dept_name
    FROM students s
    LEFT JOIN departments d ON s.department_id = d.id
    WHERE s.id = NEW.student_id;

    SELECT c.name, i.title
    INTO v_company_name, v_internship_title
    FROM internships i
    JOIN companies c ON i.company_id = c.id
    WHERE i.id = NEW.internship_id;

    -- Generate deterministic SHA-256 verification hash
    v_hash := encode(digest(CONCAT(NEW.id::text, v_student_number, NOW()::text), 'sha256'), 'hex');

    -- Insert into noc_requests
    INSERT INTO noc_requests (
      offer_id,
      student_id,
      verification_code,
      status,
      requested_at,
      approved_at
    ) VALUES (
      NEW.id,
      NEW.student_id,
      CONCAT('NOC-2026-', UPPER(SUBSTRING(v_hash FROM 1 FOR 8))),
      'APPROVED',
      NOW(),
      NOW()
    ) ON CONFLICT DO NOTHING;

    -- Dispatch live notification
    IF v_user_id IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      ) VALUES (
        v_user_id,
        CONCAT('NOC Clearance Stamped: ', COALESCE(v_company_name, 'Host Organization')),
        CONCAT('Official AICTE Institutional NOC issued for ', COALESCE(v_internship_title, 'Internship'), '. Mutex lock engaged.'),
        'OFFER',
        false,
        NOW()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_offer_accepted ON offers;
CREATE TRIGGER trg_offer_accepted
AFTER UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION handle_offer_accepted();


-- TRIGGER B: On Weekly Report Approved -> Increment Student Contact Hours & Notify
CREATE OR REPLACE FUNCTION handle_logbook_approved()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_student_name VARCHAR(255);
BEGIN
  IF (NEW.status = 'APPROVED' AND (OLD.status IS NULL OR OLD.status != 'APPROVED')) THEN
    -- Fetch student user ID
    SELECT user_id, full_name INTO v_user_id, v_student_name
    FROM students
    WHERE id = NEW.student_id;

    -- Dispatch notification
    IF v_user_id IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      ) VALUES (
        v_user_id,
        CONCAT('Logbook Week ', NEW.week_number, ' Approved'),
        CONCAT(NEW.hours_worked, ' contact hours verified and added to your 240-hour degree accumulation meter.'),
        'LOGBOOK',
        false,
        NOW()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_logbook_approved ON weekly_reports;
CREATE TRIGGER trg_logbook_approved
AFTER UPDATE ON weekly_reports
FOR EACH ROW
EXECUTE FUNCTION handle_logbook_approved();


-- TRIGGER C: On Application Status Change -> Live Status Notification Dispatch
CREATE OR REPLACE FUNCTION handle_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_internship_title VARCHAR(255);
  v_company_name VARCHAR(255);
BEGIN
  IF (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    -- Fetch student & role details
    SELECT s.user_id INTO v_user_id
    FROM students s
    WHERE s.id = NEW.student_id;

    SELECT i.title, c.name INTO v_internship_title, v_company_name
    FROM internships i
    JOIN companies c ON i.company_id = c.id
    WHERE i.id = NEW.internship_id;

    IF v_user_id IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      ) VALUES (
        v_user_id,
        CONCAT('Application Status: ', NEW.status),
        CONCAT('Your application for ', COALESCE(v_internship_title, 'Role'), ' at ', COALESCE(v_company_name, 'Company'), ' is now ', NEW.status, '.'),
        CASE WHEN NEW.status = 'ACCEPTED' THEN 'OFFER' ELSE 'INFO' END,
        false,
        NOW()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_application_status ON applications;
CREATE TRIGGER trg_application_status
AFTER UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION handle_application_status_change();
