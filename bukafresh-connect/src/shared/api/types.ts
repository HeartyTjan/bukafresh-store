// Shared API response types
export interface ApiResponse<T> {
  status: 'success' | 'failed';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'failed';
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
