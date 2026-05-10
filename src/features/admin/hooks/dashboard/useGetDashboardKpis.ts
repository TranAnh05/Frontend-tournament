import { useState, useCallback } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import type {
    DashboardKpiResponse,
    DashboardFilterParams,
} from "../../types/dashboard";

export const useGetDashboardKpis = () => {
    const [data, setData] = useState<DashboardKpiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchKpis = useCallback(async (params?: DashboardFilterParams) => {
        setIsLoading(true);
        try {
            const response = await dashboardApi.getKpis(params);
            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu KPI Dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, fetchKpis };
};
