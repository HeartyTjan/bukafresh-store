import { API } from '@/shared/api/axiosInstance';
import type { Product, ProductCategory } from '@/types';

export interface ProductsResponse {
  status: 'success' | 'failed';
  data: Product[];
}

export interface ProductResponse {
  status: 'success' | 'failed';
  data: Product;
}

export interface CategoriesResponse {
  status: 'success' | 'failed';
  data: ProductCategory[];
}

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  inStock?: boolean;
  popular?: boolean;
}

export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.inStock !== undefined) params.append('inStock', String(filters.inStock));
  if (filters?.popular !== undefined) params.append('popular', String(filters.popular));
  
  const queryString = params.toString();
  const { data } = await API.get(`/products.list${queryString ? `?${queryString}` : ''}`);
  return data;
}

export async function getProductById(id: string): Promise<ProductResponse> {
  const { data } = await API.get(`/product.${id}`);
  return data;
}

export async function getProductCategories(): Promise<CategoriesResponse> {
  const { data } = await API.get('/products.categories');
  return data;
}

export async function getPopularProducts(): Promise<ProductsResponse> {
  const { data } = await API.get('/products.popular');
  return data;
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const { data } = await API.get(`/products.search?q=${encodeURIComponent(query)}`);
  return data;
}
