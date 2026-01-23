import { API } from '@/shared/api/axiosInstance';
import type { Product } from '@/types';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  updatedAt: string;
}

export interface CartResponse {
  status: 'success' | 'failed';
  data: Cart;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

export async function getCart(): Promise<CartResponse> {
  const { data } = await API.get('/cart.get');
  return data;
}

export async function addToCart(payload: AddToCartPayload): Promise<CartResponse> {
  const { data } = await API.post('/cart.add', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to add item to cart');
  }
  
  return data;
}

export async function updateCartItem(payload: UpdateCartItemPayload): Promise<CartResponse> {
  const { data } = await API.post('/cart.update', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to update cart item');
  }
  
  return data;
}

export async function removeFromCart(itemId: string): Promise<CartResponse> {
  const { data } = await API.post('/cart.remove', { itemId });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to remove item from cart');
  }
  
  return data;
}

export async function clearCart(): Promise<{ status: 'success' | 'failed' }> {
  const { data } = await API.post('/cart.clear');
  return data;
}
