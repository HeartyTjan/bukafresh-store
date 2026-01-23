import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardOverview,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from './api';

export const overviewKeys = {
  all: ['overview'] as const,
  dashboard: () => [...overviewKeys.all, 'dashboard'] as const,
  notifications: () => [...overviewKeys.all, 'notifications'] as const,
};

export const useGetDashboardOverview = () =>
  useQuery({
    queryKey: overviewKeys.dashboard(),
    queryFn: getDashboardOverview,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const useGetNotifications = () =>
  useQuery({
    queryKey: overviewKeys.notifications(),
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: overviewKeys.notifications() });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: overviewKeys.notifications() });
    },
  });
};
