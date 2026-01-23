import { API } from '@/shared/api/axiosInstance';
import type { User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  status: 'success' | 'failed';
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await API.post('/auth.login', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Login failed');
  }
  
  // Store token
  if (data.data?.token) {
    localStorage.setItem('auth_token', data.data.token);
  }
  
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await API.post('/auth.register', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Registration failed');
  }
  
  // Store token
  if (data.data?.token) {
    localStorage.setItem('auth_token', data.data.token);
  }
  
  return data;
}

export async function logout(): Promise<{ status: 'success' | 'failed' }> {
  const { data } = await API.post('/auth.logout');
  localStorage.removeItem('auth_token');
  return data;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const { data } = await API.get('/auth.me');
  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ status: 'success' | 'failed'; message?: string }> {
  const { data } = await API.post('/auth.forgotPassword', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to send reset email');
  }
  
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ status: 'success' | 'failed'; message?: string }> {
  const { data } = await API.post('/auth.resetPassword', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to reset password');
  }
  
  return data;
}

export async function verifyEmail(token: string): Promise<{ status: 'success' | 'failed'; message?: string }> {
  const { data } = await API.post('/auth.verifyEmail', { token });
  return data;
}

export async function resendVerificationEmail(): Promise<{ status: 'success' | 'failed'; message?: string }> {
  const { data } = await API.post('/auth.resendVerification');
  return data;
}
