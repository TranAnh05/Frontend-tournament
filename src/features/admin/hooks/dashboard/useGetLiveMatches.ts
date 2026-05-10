import { useState, useCallback } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import { type LiveMatchResponse } from "../../types/dashboard";

export const useGetLiveMatches = () => {
    const [data, setData] = useState<LiveMatchResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchLiveMatches = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await dashboardApi.getLiveMatches();
            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách Trận đấu Live:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, fetchLiveMatches };
};
