import { API } from '@/shared/api/axiosInstance';
import type { Package, Subscription } from '@/types';

export interface SubscriptionResponse {
  status: 'success' | 'failed';
  data: Subscription;
  message?: string;
}

export interface PackagesResponse {
  status: 'success' | 'failed';
  data: Package[];
}

export interface UpdateSubscriptionPayload {
  subscriptionId: string;
  packageId?: string;
  deliveryFrequency?: 'weekly' | 'monthly';
  deliveryDay?: string;
}

export interface PauseSubscriptionPayload {
  subscriptionId: string;
  pauseUntil: string; // ISO date string
}

export async function getPackages(): Promise<PackagesResponse> {
  const { data } = await API.get('/packages.list');
  return data;
}

export async function getCurrentSubscription(): Promise<SubscriptionResponse> {
  const { data } = await API.get('/subscription.current');
  return data;
}

export async function createSubscription(payload: {
  packageId: string;
  deliveryFrequency: 'weekly' | 'monthly';
  deliveryDay: string;
  addressId: string;
}): Promise<SubscriptionResponse> {
  const { data } = await API.post('/subscription.create', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to create subscription');
  }
  
  return data;
}

export async function updateSubscription(payload: UpdateSubscriptionPayload): Promise<SubscriptionResponse> {
  const { data } = await API.post('/subscription.update', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to update subscription');
  }
  
  return data;
}

export async function pauseSubscription(payload: PauseSubscriptionPayload): Promise<SubscriptionResponse> {
  const { data } = await API.post('/subscription.pause', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to pause subscription');
  }
  
  return data;
}

export async function resumeSubscription(subscriptionId: string): Promise<SubscriptionResponse> {
  const { data } = await API.post('/subscription.resume', { subscriptionId });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to resume subscription');
  }
  
  return data;
}

export async function cancelSubscription(subscriptionId: string): Promise<SubscriptionResponse> {
  const { data } = await API.post('/subscription.cancel', { subscriptionId });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to cancel subscription');
  }
  
  return data;
}

export async function changePlan(payload: {
  subscriptionId: string;
  newPackageId: string;
  deliveryFrequency: 'weekly' | 'monthly';
}): Promise<SubscriptionResponse> {
  const { data } = await API.post('/subscription.changePlan', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to change plan');
  }
  
  return data;
}
