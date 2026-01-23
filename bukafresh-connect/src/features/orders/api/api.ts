import { API } from '@/shared/api/axiosInstance';
import type { Order, OrderItem } from '@/types';

export interface OrdersResponse {
  status: 'success' | 'failed';
  data: Order[];
}

export interface OrderResponse {
  status: 'success' | 'failed';
  data: Order;
}

export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  addressId: string;
}

export async function getOrders(): Promise<OrdersResponse> {
  const { data } = await API.get('/orders.list');
  return data;
}

export async function getOrderById(id: string): Promise<OrderResponse> {
  const { data } = await API.get(`/order.${id}`);
  return data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const { data } = await API.post('/order.create', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to create order');
  }
  
  return data;
}

export async function cancelOrder(orderId: string): Promise<OrderResponse> {
  const { data } = await API.post('/order.cancel', { orderId });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to cancel order');
  }
  
  return data;
}

export async function reorderFromPrevious(orderId: string): Promise<OrderResponse> {
  const { data } = await API.post('/order.reorder', { orderId });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to reorder');
  }
  
  return data;
}
