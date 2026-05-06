import api from '@/services/api';
import { type AuthResponse, type LoginRequest, type RegisterRequest } from '../types';
import type { ApiResponse } from '@/types/api';

export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/auth/login', data);
  },

  register: (data: RegisterRequest): Promise<ApiResponse<string>> => {
    return api.post('/auth/register', data);
  },
};