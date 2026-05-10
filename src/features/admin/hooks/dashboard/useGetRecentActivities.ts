import { useState, useCallback } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import { type ActivityLogResponse } from "../../types/dashboard";

export const useGetRecentActivities = () => {
    const [data, setData] = useState<ActivityLogResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchActivities = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await dashboardApi.getRecentActivities();
            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error("Lỗi khi tải Nhật ký hoạt động:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, fetchActivities };
};
