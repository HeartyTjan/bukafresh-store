import { API } from '@/shared/api/axiosInstance';
import type { BankDetails } from '@/types';

export interface PaymentMethod {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface AddPaymentMethodPayload {
  bvn: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface VerifyAccountPayload {
  bankCode: string;
  accountNumber: string;
}

export interface VerifyAccountResponse {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

export interface CreateMandatePayload {
  paymentMethodId: string;
  subscriptionId: string;
  amount: number;
}

export async function getPaymentMethods() {
  const { data } = await API.get('/paymethod.list');
  return data;
}

export async function addPaymentMethod(payload: AddPaymentMethodPayload) {
  const { data } = await API.post('/paymethod.new', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to add payment method');
  }
  
  return data;
}

export async function deletePaymentMethod(id: string) {
  const { data } = await API.get(`/paymethod.${id}.delete`);
  return data;
}

export async function updatePaymentMethod(payload: Partial<PaymentMethod> & { id: string }) {
  const { data } = await API.post('/paymethod.change', payload);
  return data;
}

export async function setDefaultPaymentMethod(id: string) {
  const { data } = await API.post('/paymethod.default', { id });
  return data;
}

export async function verifyBankAccount(payload: VerifyAccountPayload): Promise<VerifyAccountResponse> {
  const { data } = await API.post('/paymethod.verify', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to verify account');
  }
  
  return data.data;
}

export async function createMandate(payload: CreateMandatePayload) {
  const { data } = await API.post('/mandate.create', payload);
  
  if (data.status === 'failed') {
    throw new Error(data.message || 'Failed to create mandate');
  }
  
  return data;
}

export async function cancelMandate(mandateId: string) {
  const { data } = await API.post(`/mandate.${mandateId}.cancel`);
  return data;
}
