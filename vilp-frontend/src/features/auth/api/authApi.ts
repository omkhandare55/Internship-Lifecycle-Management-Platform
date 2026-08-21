import axiosInstance from '@/services/axiosInstance';
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  AuthUser,
  ApiResponse,
} from '@/types/auth.types';

/**
 * Auth API functions — all calls to /api/auth/*
 * Source: TRD §34
 */

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.post<ApiResponse<string>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await axiosInstance.post<ApiResponse<TokenResponse>>('/auth/login', data);
    return res.data;
  },

  firebaseLogin: async (data: {
    email: string;
    displayName?: string | null;
    uid?: string;
    idToken?: string;
    role?: string;
  }): Promise<ApiResponse<TokenResponse>> => {
    const res = await axiosInstance.post<ApiResponse<TokenResponse>>('/auth/firebase-login', data);
    return res.data;
  },

  refresh: async (data: RefreshTokenRequest): Promise<ApiResponse<TokenResponse>> => {
    const res = await axiosInstance.post<ApiResponse<TokenResponse>>('/auth/refresh', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  verifyEmail: async (token: string): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.get<ApiResponse<string>>(`/auth/verify-email?token=${token}`);
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.post<ApiResponse<string>>('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.post<ApiResponse<string>>('/auth/reset-password', data);
    return res.data;
  },

  me: async (): Promise<ApiResponse<AuthUser>> => {
    const res = await axiosInstance.get<ApiResponse<AuthUser>>('/auth/me');
    return res.data;
  },
};
