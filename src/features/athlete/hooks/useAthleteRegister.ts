import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { athleteAuthApi } from '../api/athleteAuthApi';
import type { AthleteRegisterRequest } from '../types';

export const useAthleteRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const register = async (data: AthleteRegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await athleteAuthApi.register(data);
            toast.success(response.message ?? 'Đăng ký tài khoản VĐV thành công!', { autoClose: 2000 });
            setTimeout(() => {
                navigate('/login');
                setIsLoading(false);
            }, 3000);
        } catch (error) {
            console.error('Lỗi đăng ký VĐV:', error);
            setIsLoading(false);
        }
    };

    return { register, isLoading };
};