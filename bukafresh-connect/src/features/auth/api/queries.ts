import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  login,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  type LoginPayload,
  type RegisterPayload,
  type ForgotPasswordPayload,
  type ResetPasswordPayload,
} from './api';

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 401
  });

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(authKeys.user(), data);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(authKeys.user(), data);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data on logout
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
};
