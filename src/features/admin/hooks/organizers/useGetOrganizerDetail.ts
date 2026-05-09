import { useState, useCallback } from "react";
import { organizersApi } from "../../api/organizersApi";
import { type OrganizerDetailResponse } from "../../types/organizers";

export const useGetOrganizerDetail = () => {
    const [data, setData] = useState<OrganizerDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchDetail = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const response = await organizersApi.getDetail(id);
            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết hồ sơ BTC (ID: ${id}):`, error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetDetail = useCallback(() => {
        setData(null);
    }, []);

    return {
        data,
        isLoading,
        fetchDetail,
        resetDetail,
    };
};
