import { useState, useCallback } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import type {
    DashboardChartsResponse,
    DashboardFilterParams,
} from "../../types/dashboard";

export const useGetDashboardCharts = () => {
    const [data, setData] = useState<DashboardChartsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCharts = useCallback(async (params?: DashboardFilterParams) => {
        setIsLoading(true);
        try {
            const response = await dashboardApi.getCharts(params);
            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Biểu đồ Dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, fetchCharts };
};
