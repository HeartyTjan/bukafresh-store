import { API } from '@/shared/api/axiosInstance';
import type { User } from '@/types';

export interface UserProfileResponse {
  status: 'success' | 'failed';
  data: User;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationPreferences {
  email: {
    orderUpdates: boolean;
    deliveryReminders: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  sms: {
    orderUpdates: boolean;
    deliveryReminders: boolean;
  };
  push: {
    orderUpdates: boolean;
    deliveryReminders: boolean;
  };
}

export interface NotificationPreferencesResponse {
  status: 'success' | 'failed';
  data: NotificationPreferences;
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  const { data } = await API.get('/user.profile');
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfileResponse> {
  const { data } = await API.post('/user.profile.update', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to update profile');
  }
  
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ status: 'success' | 'failed'; message?: string }> {
  const { data } = await API.post('/user.password.change', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to change password');
  }
  
  return data;
}

export async function getNotificationPreferences(): Promise<NotificationPreferencesResponse> {
  const { data } = await API.get('/user.notifications.preferences');
  return data;
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferences
): Promise<NotificationPreferencesResponse> {
  const { data } = await API.post('/user.notifications.preferences.update', preferences);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to update notification preferences');
  }
  
  return data;
}

export async function deleteAccount(): Promise<{ status: 'success' | 'failed' }> {
  const { data } = await API.post('/user.delete');
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to delete account');
  }
  
  return data;
}

export async function uploadAvatar(file: File): Promise<{ status: 'success' | 'failed'; data?: { url: string } }> {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const { data } = await API.post('/user.avatar.upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to upload avatar');
  }
  
  return data;
}
