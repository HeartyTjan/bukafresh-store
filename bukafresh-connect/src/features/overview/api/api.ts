import { API } from '@/shared/api/axiosInstance';
import type { Subscription, Delivery, Order } from '@/types';

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  nextDeliveryDate: string | null;
  subscriptionStatus: 'active' | 'paused' | 'cancelled' | 'none';
}

export interface DashboardOverviewResponse {
  status: 'success' | 'failed';
  data: {
    stats: DashboardStats;
    currentSubscription: Subscription | null;
    nextDelivery: Delivery | null;
    recentOrders: Order[];
  };
}

export interface NotificationsResponse {
  status: 'success' | 'failed';
  data: Array<{
    id: string;
    type: 'info' | 'warning' | 'success';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  const { data } = await API.get('/dashboard.overview');
  return data;
}

export async function getNotifications(): Promise<NotificationsResponse> {
  const { data } = await API.get('/notifications.list');
  return data;
}

export async function markNotificationRead(notificationId: string): Promise<{ status: 'success' | 'failed' }> {
  const { data } = await API.post('/notification.read', { notificationId });
  return data;
}

export async function markAllNotificationsRead(): Promise<{ status: 'success' | 'failed' }> {
  const { data } = await API.post('/notifications.readAll');
  return data;
}
