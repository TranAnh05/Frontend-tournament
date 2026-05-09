import { useState } from "react";
import { toast } from "react-toastify";
import { organizersApi } from "../../api/organizersApi";
import { type OrganizerStatusUpdateRequest } from "../../types/organizers";

export const useMutateOrganizer = () => {
    const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);

    const toggleOrganizerStatus = async (
        id: number,
        data: OrganizerStatusUpdateRequest,
        onSuccess?: () => void,
    ) => {
        setIsChangingStatus(true);
        try {
            const response = await organizersApi.updateStatus(id, data);

            toast.success(
                response.message || "Cập nhật trạng thái thành công!",
            );

            if (onSuccess) {
                onSuccess();
            }

            return response.result;
        } catch (error) {
            console.error("Lỗi khi đổi trạng thái BTC:", error);
            throw error;
        } finally {
            setIsChangingStatus(false);
        }
    };

    return {
        toggleOrganizerStatus,
        isChangingStatus,
    };
};
