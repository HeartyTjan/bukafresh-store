import { API } from '@/shared/api/axiosInstance';
import type { Address } from '@/types';

export interface AddressesResponse {
  status: 'success' | 'failed';
  data: Address[];
}

export interface AddressResponse {
  status: 'success' | 'failed';
  data: Address;
}

export interface CreateAddressPayload {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  instructions?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {
  id: string;
}

export async function getAddresses(): Promise<AddressesResponse> {
  const { data } = await API.get('/addresses.list');
  return data;
}

export async function getAddressById(id: string): Promise<AddressResponse> {
  const { data } = await API.get(`/address.${id}`);
  return data;
}

export async function createAddress(payload: CreateAddressPayload): Promise<AddressResponse> {
  const { data } = await API.post('/address.create', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to create address');
  }
  
  return data;
}

export async function updateAddress(payload: UpdateAddressPayload): Promise<AddressResponse> {
  const { data } = await API.post('/address.update', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to update address');
  }
  
  return data;
}

export async function deleteAddress(id: string): Promise<{ status: 'success' | 'failed' }> {
  const { data } = await API.post('/address.delete', { id });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to delete address');
  }
  
  return data;
}

export async function setDefaultAddress(id: string): Promise<AddressResponse> {
  const { data } = await API.post('/address.setDefault', { id });
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to set default address');
  }
  
  return data;
}
