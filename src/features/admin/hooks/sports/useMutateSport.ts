import { useState } from "react";
import { toast } from "react-toastify";
import { sportsApi } from "../../api/sportsApi";
import {
    type SportCreateRequest,
    type SportUpdateRequest,
    type StatusUpdateRequest,
} from "../../types/sports";

export const useMutateSport = () => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);

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

    const updateSport = async (
        id: number,
        data: SportUpdateRequest,
        onSuccess?: () => void,
    ) => {
        setIsUpdating(true);
        try {
            const response = await sportsApi.update(id, data);
            toast.success(
                response.message || "Cập nhật môn thể thao thành công!",
            );

            if (onSuccess) {
                onSuccess();
            }
            return response.result;
        } catch (error) {
            console.error("Lỗi khi cập nhật môn thể thao:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleSportStatus = async (
        id: number,
        data: StatusUpdateRequest,
        onSuccess?: () => void,
    ) => {
        setIsChangingStatus(true);
        try {
            const response = await sportsApi.updateStatus(id, data);
            toast.success(
                response.message || "Thay đổi trạng thái thành công!",
            );
            onSuccess?.();
            return response.result;
        } catch (error) {
            console.error("Toggle status error:", error);
            throw error;
        } finally {
            setIsChangingStatus(false);
        }
    };

    // Cờ gộp chung giúp UI Form dễ dàng quản lý trạng thái disabled/loading của nút Save
    const isSubmitting = isCreating || isUpdating;

    return {
        createSport,
        updateSport,
        isCreating,
        isUpdating,
        isSubmitting,
        toggleSportStatus,
        isChangingStatus
    };
};
