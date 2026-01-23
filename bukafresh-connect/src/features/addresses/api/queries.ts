import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type CreateAddressPayload,
  type UpdateAddressPayload,
} from './api';

export const addressKeys = {
  all: ['addresses'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
  detail: (id: string) => [...addressKeys.all, 'detail', id] as const,
};

export const useGetAddresses = () =>
  useQuery({
    queryKey: addressKeys.list(),
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useGetAddressById = (id: string) =>
  useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => getAddressById(id),
    enabled: !!id,
  });

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) => updateAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};
