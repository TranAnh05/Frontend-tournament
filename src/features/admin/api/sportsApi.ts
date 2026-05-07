import api from '@/services/api';
import { type ApiResponse } from '@/types/api';
import { type SportCreateRequest, type SportFilterParams, type SportResponse } from '../types/sports';
import type { PageResponse } from '../types/Pagination';

export const sportsApi = {
  getSports: (params?: SportFilterParams): Promise<ApiResponse<PageResponse<SportResponse>>> => {
    return api.get('/admin/sports', { params });
  },
  
  create: (data: SportCreateRequest): Promise<ApiResponse<SportResponse>> => {
    return api.post('/admin/sports', data);
  },
};