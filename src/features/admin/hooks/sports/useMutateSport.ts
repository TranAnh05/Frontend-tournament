import { useState } from "react";
import { toast } from "react-toastify";
import { sportsApi } from "../../api/sportsApi";
import { type SportCreateRequest } from "../../types/sports";

export const useMutateSport = () => {
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const createSport = async (
        data: SportCreateRequest,
        onSuccess?: () => void,
    ) => {
        setIsCreating(true);
        try {
            const response = await sportsApi.create(data);

            toast.success(response.message || "Tạo môn thể thao thành công!");

            if (onSuccess) {
                onSuccess();
            }

            return response.result;
        } catch (error) {
            console.error("Lỗi khi tạo môn thể thao:", error);
            throw error;
        } finally {
            setIsCreating(false);
        }
    };

    return { createSport, isCreating };
};
