import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";
import { type RegisterRequest } from "../types";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const register = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await authApi.register(data);

            toast.success(response.message, { autoClose: 2000});

            setTimeout(() => {
                navigate("/login");
                setIsLoading(false);
            }, 3000);
        } catch (error) {
            console.error("Lỗi quá trình đăng ký:", error);
            setIsLoading(false);
        }
    };

    return { register, isLoading };
};
