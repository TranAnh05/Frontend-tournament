import { useState, useEffect } from "react";
import { type DashboardFilterParams } from "../types/dashboard";
import { useGetDashboardKpis } from "../hooks/dashboard/useGetDashboardKpis";
import { useGetDashboardCharts } from "../hooks/dashboard/useGetDashboardCharts";
import { useGetLiveMatches } from "../hooks/dashboard/useGetLiveMatches";
import { useGetRecentActivities } from "../hooks/dashboard/useGetRecentActivities";
import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { KpiCardsWidget } from "../components/dashboard/KpiCardsWidget";
import { ActivityTrendChart } from "../components/dashboard/charts/ActivityTrendChart";
import { SportDistributionChart } from "../components/dashboard/charts/SportDistributionChart";
import { VenueUsageChart } from "../components/dashboard/charts/VenueUsageChart";
import { LiveMatchesWidget } from "../components/dashboard/LiveMatchesWidget";
import { RecentActivitiesWidget } from "../components/dashboard/RecentActivitiesWidget";

export const AdminDashboardPage = () => {
    // STATE BỘ LỌC TOÀN CỤC
    const [filters, setFilters] = useState<DashboardFilterParams>({
        startDate: undefined,
        endDate: undefined,
        sportId: undefined,
    });

    const {
        data: kpiData,
        isLoading: isKpiLoading,
        fetchKpis,
    } = useGetDashboardKpis();
    const {
        data: chartsData,
        isLoading: isChartsLoading,
        fetchCharts,
    } = useGetDashboardCharts();
    const {
        data: liveMatchesData,
        isLoading: isLiveLoading,
        fetchLiveMatches,
    } = useGetLiveMatches();
    const {
        data: activitiesData,
        isLoading: isActivitiesLoading,
        fetchActivities,
    } = useGetRecentActivities();

    useEffect(() => {
        fetchKpis(filters);
        fetchCharts(filters);
    }, [filters, fetchKpis, fetchCharts]);

    useEffect(() => {
        fetchLiveMatches();
        fetchActivities();
    }, [fetchLiveMatches, fetchActivities]);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Tổng quan Hệ thống
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Theo dõi số liệu thống kê và hoạt động đang diễn ra của các
                    giải đấu.
                </p>
            </div>

            {/* THANH BỘ LỌC */}
            <DashboardFilterBar filters={filters} onFilterChange={setFilters} />

            {/* PHÂN KHU 1: KPI CARDS */}
            <KpiCardsWidget data={kpiData} isLoading={isKpiLoading} />

            {/* PHÂN KHU 2: CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[350px]">
                    <ActivityTrendChart
                        data={chartsData?.activityTrends}
                        isLoading={isChartsLoading}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-h-[350px]">
                        <SportDistributionChart
                            data={chartsData?.tournamentsBySport}
                            isLoading={isChartsLoading}
                        />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-h-[350px]">
                        <VenueUsageChart
                            data={chartsData?.venueUsage}
                            isLoading={isChartsLoading}
                        />
                    </div>
                </div>
            </div>

            {/* PHÂN KHU 3: BẢNG DỮ LIỆU ĐỘNG */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LiveMatchesWidget
                    data={liveMatchesData}
                    isLoading={isLiveLoading}
                />

                <RecentActivitiesWidget
                    data={activitiesData}
                    isLoading={isActivitiesLoading}
                />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
