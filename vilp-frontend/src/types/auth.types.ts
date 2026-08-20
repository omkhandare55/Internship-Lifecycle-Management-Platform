// Auth types — matches backend DTOs
// Source: TRD §10, TokenResponse DTO

export type UserRole =
  | 'STUDENT'
  | 'COMPANY'
  | 'MENTOR'
  | 'TNP_OFFICER'
  | 'TNP_HEAD'
  | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  emailVerified: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// API response wrapper — matches backend ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}
