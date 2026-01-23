import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  type AddToCartPayload,
  type UpdateCartItemPayload,
} from './api';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export const useGetCart = () =>
  useQuery({
    queryKey: cartKeys.detail(),
    queryFn: getCart,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCartItemPayload) => updateCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
