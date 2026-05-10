import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import type {
    DashboardFilterParams,
    DashboardKpiResponse,
    DashboardChartsResponse,
    LiveMatchResponse,
    ActivityLogResponse,
} from "../types/dashboard";

export const dashboardApi = {
    getKpis: (
        params?: DashboardFilterParams,
    ): Promise<ApiResponse<DashboardKpiResponse>> => {
        return api.get("/admin/dashboard/kpis", { params });
    },

    getCharts: (
        params?: DashboardFilterParams,
    ): Promise<ApiResponse<DashboardChartsResponse>> => {
        return api.get("/admin/dashboard/charts", { params });
    },

    getLiveMatches: (): Promise<ApiResponse<LiveMatchResponse[]>> => {
        return api.get("/admin/dashboard/live-matches");
    },

    getRecentActivities: (): Promise<ApiResponse<ActivityLogResponse[]>> => {
        return api.get("/admin/dashboard/recent-activities");
    },
};
