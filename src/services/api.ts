/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify'
import {type ApiResponse, type ErrorResponse } from '@/types/api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data as any;
  },
  (error: AxiosError<ErrorResponse>) => {
    const errorData = error.response?.data;

    if (errorData) {
      if (errorData.validationErrors) {
        Object.values(errorData.validationErrors).forEach((msg) => {
          toast.error(msg as string);
        });
      } 
      else if (errorData.message) {
        toast.error(errorData.message);
      }
    } else {
      toast.error('Không thể kết nối đến máy chủ!');
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;