export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}
