export interface ApiResponse<T> {
  timestamp: string;
  code: number;
  message: string;
  result: T; 
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}