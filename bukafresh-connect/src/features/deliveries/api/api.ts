import { API } from '@/shared/api/axiosInstance';
import type { Delivery } from '@/types';

export interface DeliveriesResponse {
  status: 'success' | 'failed';
  data: Delivery[];
}

export interface DeliveryResponse {
  status: 'success' | 'failed';
  data: Delivery;
}

export interface RescheduleDeliveryPayload {
  deliveryId: string;
  newDate: string; // ISO date string
}

export async function getUpcomingDeliveries(): Promise<DeliveriesResponse> {
  const { data } = await API.get('/deliveries.upcoming');
  return data;
}

export async function getDeliveryHistory(): Promise<DeliveriesResponse> {
  const { data } = await API.get('/deliveries.history');
  return data;
}

export async function getDeliveryById(id: string): Promise<DeliveryResponse> {
  const { data } = await API.get(`/delivery.${id}`);
  return data;
}

export async function rescheduleDelivery(payload: RescheduleDeliveryPayload): Promise<DeliveryResponse> {
  const { data } = await API.post('/delivery.reschedule', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to reschedule delivery');
  }
  
  return data;
}

export async function skipDelivery(deliveryId: string): Promise<DeliveryResponse> {
  const { data } = await API.post('/delivery.skip', { deliveryId });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to skip delivery');
  }
  
  return data;
}

export async function trackDelivery(deliveryId: string): Promise<DeliveryResponse> {
  const { data } = await API.get(`/delivery.${deliveryId}.track`);
  return data;
}
