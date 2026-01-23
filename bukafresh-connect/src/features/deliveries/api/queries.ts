import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUpcomingDeliveries,
  getDeliveryHistory,
  getDeliveryById,
  rescheduleDelivery,
  skipDelivery,
  trackDelivery,
  type RescheduleDeliveryPayload,
} from './api';

export const deliveryKeys = {
  all: ['deliveries'] as const,
  upcoming: () => [...deliveryKeys.all, 'upcoming'] as const,
  history: () => [...deliveryKeys.all, 'history'] as const,
  detail: (id: string) => [...deliveryKeys.all, 'detail', id] as const,
  tracking: (id: string) => [...deliveryKeys.all, 'tracking', id] as const,
};

export const useGetUpcomingDeliveries = () =>
  useQuery({
    queryKey: deliveryKeys.upcoming(),
    queryFn: getUpcomingDeliveries,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const useGetDeliveryHistory = () =>
  useQuery({
    queryKey: deliveryKeys.history(),
    queryFn: getDeliveryHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useGetDeliveryById = (id: string) =>
  useQuery({
    queryKey: deliveryKeys.detail(id),
    queryFn: () => getDeliveryById(id),
    enabled: !!id,
  });

export const useTrackDelivery = (deliveryId: string) =>
  useQuery({
    queryKey: deliveryKeys.tracking(deliveryId),
    queryFn: () => trackDelivery(deliveryId),
    enabled: !!deliveryId,
    refetchInterval: 30000, // Refresh every 30 seconds for live tracking
  });

export const useRescheduleDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RescheduleDeliveryPayload) => rescheduleDelivery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
    },
  });
};

export const useSkipDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => skipDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
    },
  });
};
