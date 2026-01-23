import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  reorderFromPrevious,
  type CreateOrderPayload,
} from './api';

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export const useGetOrders = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useGetOrderById = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useReorderFromPrevious = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => reorderFromPrevious(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
