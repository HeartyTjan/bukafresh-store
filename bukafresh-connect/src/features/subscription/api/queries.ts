import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPackages,
  getCurrentSubscription,
  createSubscription,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  changePlan,
  type UpdateSubscriptionPayload,
  type PauseSubscriptionPayload,
} from './api';

export const subscriptionKeys = {
  all: ['subscription'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
  packages: () => [...subscriptionKeys.all, 'packages'] as const,
  history: () => [...subscriptionKeys.all, 'history'] as const,
};

export const useGetPackages = () =>
  useQuery({
    queryKey: subscriptionKeys.packages(),
    queryFn: getPackages,
    staleTime: 1000 * 60 * 30, // 30 minutes - packages don't change often
  });

export const useGetCurrentSubscription = () =>
  useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: getCurrentSubscription,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      packageId: string;
      deliveryFrequency: 'weekly' | 'monthly';
      deliveryDay: string;
      addressId: string;
    }) => createSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSubscriptionPayload) => updateSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    },
  });
};

export const usePauseSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PauseSubscriptionPayload) => pauseSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    },
  });
};

export const useResumeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => resumeSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

export const useChangePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      subscriptionId: string;
      newPackageId: string;
      deliveryFrequency: 'weekly' | 'monthly';
    }) => changePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};
