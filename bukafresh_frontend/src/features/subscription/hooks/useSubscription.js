import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../api/subscriptionService";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

// Query keys for React Query
export const SUBSCRIPTION_KEYS = {
  current: ["subscription", "current"],
  all: ["subscription", "all"],
};

// Hook to get current subscription
export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.current,
    queryFn: subscriptionService.getCurrentSubscription,
    retry: (failureCount, error) => {
      // Don't retry if user has no subscription (404)
      if (error?.message?.includes("No active subscription")) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get all user subscriptions
export const useAllSubscriptions = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.all,
    queryFn: subscriptionService.getAllUserSubscriptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionId, reason }) =>
      subscriptionService.cancelSubscription(subscriptionId, reason),
    onSuccess: (data) => {
      // Invalidate and refetch subscription queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.current });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
      showSuccessAlert(
        "Subscription Cancelled",
        "Your subscription has been successfully cancelled. You can reactivate it anytime.",
      );
    },
    onError: (error) => {
      console.error("Cancel subscription mutation error:", error);
      showErrorAlert(
        "Cancellation Failed",
        error.message || "Failed to cancel subscription. Please try again.",
      );
    },
  });
};

// Hook to pause subscription
export const usePauseSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionId, pauseUntil }) =>
      subscriptionService.pauseSubscription(subscriptionId, pauseUntil),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.current });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
      showSuccessAlert(
        "Subscription Paused",
        "Your subscription has been paused successfully.",
      );
    },
    onError: (error) => {
      console.error("Pause subscription mutation error:", error);
      showErrorAlert(
        "Pause Failed",
        error.message || "Failed to pause subscription. Please try again.",
      );
    },
  });
};

// Hook to resume subscription
export const useResumeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId) =>
      subscriptionService.resumeSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.current });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
      showSuccessAlert(
        "Subscription Resumed",
        "Your subscription has been resumed successfully.",
      );
    },
    onError: (error) => {
      console.error("Resume subscription mutation error:", error);
      showErrorAlert(
        "Resume Failed",
        error.message || "Failed to resume subscription. Please try again.",
      );
    },
  });
};

// Hook to create subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionData) =>
      subscriptionService.createSubscription(subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.current });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
      showSuccessAlert(
        "Subscription Created",
        "Your subscription has been created successfully.",
      );
    },
    onError: (error) => {
      console.error("Create subscription mutation error:", error);
      showErrorAlert(
        "Creation Failed",
        error.message || "Failed to create subscription. Please try again.",
      );
    },
  });
};

// Hook to activate subscription
export const useActivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId) =>
      subscriptionService.activateSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.current });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
      showSuccessAlert(
        "Subscription Activated",
        "Your subscription has been activated successfully!",
      );
    },
    onError: (error) => {
      console.error("Activate subscription mutation error:", error);
      showErrorAlert(
        "Activation Failed",
        error.message || "Failed to activate subscription. Please try again.",
      );
    },
  });
};

// Hook to delete subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId) =>
      subscriptionService.deleteSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.current });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
      showSuccessAlert(
        "Subscription Deleted",
        "Your subscription has been deleted successfully.",
      );
    },
    onError: (error) => {
      console.error("Delete subscription mutation error:", error);
      showErrorAlert(
        "Deletion Failed",
        error.message || "Failed to delete subscription. Please try again.",
      );
    },
  });
};
