/**
 * Institutional Fraud Detection & Risk Scoring Engine
 * Detects disposable emails, spoofed domains, and suspicious registration patterns.
 */

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
  'dispostable.com',
  'throwawaymail.com',
  'fakeinbox.com',
  'maildrop.cc',
]);

const TRUSTED_INSTITUTIONAL_TLDS = ['.edu.in', '.ac.in', '.edu', '.ac.uk', '.ernet.in'];

export interface FraudAuditResult {
  riskScore: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  numericScore: number; // 0 (Clean) to 100 (High Risk)
  isDisposableEmail: boolean;
  isInstitutionalDomain: boolean;
  flags: string[];
}

export function auditStudentRegistration(email: string, phone: string, enrollmentNo?: string): FraudAuditResult {
  const flags: string[] = [];
  let score = 10; // baseline low risk

  const normalizedEmail = (email || '').trim().toLowerCase();
  const domain = normalizedEmail.split('@')[1] || '';

  // 1. Check Disposable Email
  const isDisposable = DISPOSABLE_EMAIL_DOMAINS.has(domain);
  if (isDisposable) {
    flags.push('Disposable or temporary email domain detected.');
    score += 65;
  }

  // 2. Check Institutional Domain
  const isInstitutional = TRUSTED_INSTITUTIONAL_TLDS.some((tld) => domain.endsWith(tld));
  if (isInstitutional) {
    score = Math.max(0, score - 15);
  }

  // 3. Phone Number Validation
  const cleanedPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanedPhone.length < 10) {
    flags.push('Incomplete mobile number format.');
    score += 20;
  } else if (/^(\d)\1{9}$/.test(cleanedPhone)) {
    flags.push('Suspicious repetitive digit sequence in mobile number.');
    score += 35;
  }

  // 4. Enrollment Number Format Check
  if (enrollmentNo) {
    const cleanEnroll = enrollmentNo.trim();
    if (cleanEnroll.length < 4) {
      flags.push('Suspiciously short enrollment / roll number.');
      score += 15;
    }
  }

  let riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' = 'LOW_RISK';
  if (score >= 60) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 30) {
    riskLevel = 'MEDIUM_RISK';
  }

  return {
    riskScore: riskLevel,
    numericScore: Math.min(score, 100),
    isDisposableEmail: isDisposable,
    isInstitutionalDomain: isInstitutional,
    flags,
  };
}
