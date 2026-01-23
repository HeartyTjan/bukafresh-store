import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
  setDefaultPaymentMethod,
  verifyBankAccount,
  createMandate,
  cancelMandate,
  type AddPaymentMethodPayload,
  type VerifyAccountPayload,
  type CreateMandatePayload,
  type PaymentMethod,
} from './api';

export const paymentKeys = {
  all: ['payment'] as const,
  methods: () => [...paymentKeys.all, 'methods'] as const,
  method: (id: string) => [...paymentKeys.methods(), id] as const,
  mandates: () => [...paymentKeys.all, 'mandates'] as const,
};

export const useGetPaymentMethods = () =>
  useQuery({
    queryKey: paymentKeys.methods(),
    queryFn: getPaymentMethods,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddPaymentMethodPayload) => addPaymentMethod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() });
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<PaymentMethod> & { id: string }) => updatePaymentMethod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() });
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() });
    },
  });
};

export const useVerifyBankAccount = () => {
  return useMutation({
    mutationFn: (payload: VerifyAccountPayload) => verifyBankAccount(payload),
  });
};

export const useCreateMandate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMandatePayload) => createMandate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
};

export const useCancelMandate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mandateId: string) => cancelMandate(mandateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.mandates() });
    },
  });
};
