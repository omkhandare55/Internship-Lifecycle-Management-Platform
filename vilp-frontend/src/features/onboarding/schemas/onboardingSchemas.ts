import { z } from 'zod';

export const step1IdentitySchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least 1 special character'),
  emailOtp: z.string().length(6, 'Email OTP must be exactly 6 digits'),
  mobileOtp: z.string().length(6, 'Mobile OTP must be exactly 6 digits'),
});

export const step2VerificationSchema = z.object({
  collegeName: z.string().min(2, 'College / Institute name is required'),
  universityName: z.string().min(2, 'University name is required'),
  branch: z.string().min(2, 'Branch / Department is required'),
  currentYear: z.enum(['1st Year', '2nd Year', '3rd Year', 'Final Year (4th)', 'Postgraduate']),
  enrollmentNumber: z.string().min(3, 'Valid enrollment / roll number is required'),
  verificationMethod: z.enum(['COLLEGE_EMAIL', 'STUDENT_ID_CARD', 'MANUAL_REVIEW']),
  collegeEmail: z.string().email().optional(),
});

export const step6CareerGoalsSchema = z.object({
  dreamRole: z.string().min(2, 'Please specify your target role'),
  dreamCompanies: z.array(z.string()).min(1, 'Select at least 1 target organization'),
  preferredIndustry: z.string().min(2, 'Target industry is required'),
  targetGraduationYear: z.number().int().min(2024).max(2030),
  internshipInterest: z.boolean().default(true),
  higherStudiesInterest: z.boolean().default(false),
  startupInterest: z.boolean().default(false),
});

export const step7CodingProfilesSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  leetcode: z.string().optional(),
  hackerrank: z.string().optional(),
  codechef: z.string().optional(),
  portfolio: z.string().optional(),
});

export type Step1IdentityData = z.infer<typeof step1IdentitySchema>;
export type Step2VerificationData = z.infer<typeof step2VerificationSchema>;
export type Step6CareerGoalsData = z.infer<typeof step6CareerGoalsSchema>;
export type Step7CodingProfilesData = z.infer<typeof step7CodingProfilesSchema>;
