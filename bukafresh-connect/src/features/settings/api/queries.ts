import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateProfile,
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  deleteAccount,
  uploadAvatar,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
  type NotificationPreferences,
} from './api';

export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
};

export const useGetUserProfile = () =>
  useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
};

export const useGetNotificationPreferences = () =>
  useQuery({
    queryKey: settingsKeys.notifications(),
    queryFn: getNotificationPreferences,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: NotificationPreferences) => updateNotificationPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notifications() });
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
    },
  });
};
