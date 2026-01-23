import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
  getProductCategories,
  getPopularProducts,
  searchProducts,
  type ProductFilters,
} from './api';

export const productKeys = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  popular: () => [...productKeys.all, 'popular'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

export const useGetProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useGetProductById = (id: string) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

export const useGetProductCategories = () =>
  useQuery({
    queryKey: productKeys.categories(),
    queryFn: getProductCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  });

export const useGetPopularProducts = () =>
  useQuery({
    queryKey: productKeys.popular(),
    queryFn: getPopularProducts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const useSearchProducts = (query: string) =>
  useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2, // Only search when query is at least 2 chars
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
