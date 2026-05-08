import { useState } from "react";
import { toast } from "react-toastify";
import { venuesApi } from "../../api/venuesApi";
import {
    type VenueRequest,
    type VenueStatusUpdateRequest,
} from "../../types/venues";

export const useMutateVenue = () => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);

    const createVenue = async (data: VenueRequest, onSuccess?: () => void) => {
        setIsCreating(true);
        try {
            const response = await venuesApi.create(data);
            toast.success(response.message || "Tạo địa điểm thành công!");
            onSuccess?.();
            return response.result;
        } catch (error) {
            console.error("Lỗi khi tạo địa điểm:", error);
            throw error;
        } finally {
            setIsCreating(false);
        }
    };

    const updateVenue = async (
        id: number,
        data: VenueRequest,
        onSuccess?: () => void,
    ) => {
        setIsUpdating(true);
        try {
            const response = await venuesApi.update(id, data);
            toast.success(response.message || "Cập nhật địa điểm thành công!");
            onSuccess?.();
            return response.result;
        } catch (error) {
            console.error("Lỗi khi cập nhật địa điểm:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleVenueStatus = async (
        id: number,
        data: VenueStatusUpdateRequest,
        onSuccess?: () => void,
    ) => {
        setIsChangingStatus(true);
        try {
            const response = await venuesApi.updateStatus(id, data);
            toast.success(
                response.message || "Thay đổi trạng thái thành công!",
            );
            onSuccess?.();
            return response.result;
        } catch (error) {
            console.error("Lỗi khi đổi trạng thái:", error);
            throw error;
        } finally {
            setIsChangingStatus(false);
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return {
        createVenue,
        updateVenue,
        toggleVenueStatus,
        isCreating,
        isUpdating,
        isChangingStatus,
        isSubmitting,
    };
};
