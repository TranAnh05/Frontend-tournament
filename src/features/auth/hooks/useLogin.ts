import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import {type LoginRequest } from '../types';
import { getHomeRoute } from '../utils/authHelper';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      
      // Cập nhật Zustand Store
      loginSuccess(res.result);
      
      // Thông báo và điều hướng
      toast.success(`Đăng nhập thành công`);
      const homeRoute = getHomeRoute(res.result.roles);
      navigate(homeRoute, { replace: true });
      
    } catch (error) {
      // Interceptor đã tự động bắn toast.error() 
      console.error('Lỗi quá trình đăng nhập:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};