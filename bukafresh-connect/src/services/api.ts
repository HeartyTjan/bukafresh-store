// Base API configuration
// This file provides the foundation for API calls
// Replace mock implementations with real API endpoints when backend is ready

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.message || 'An error occurred',
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error',
      status: 500,
    };
  }
}

// Helper function to simulate API delay for mock data
export function simulateApiDelay<T>(data: T, delay = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}
