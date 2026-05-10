/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useCallback, useEffect } from "react";
import { refereeMatchesApi } from "../../api/matchesApi";
import { type RefereeAssignedMatchResponse } from "../../types/matches";

export const useGetAssignedMatches = () => {
    const [data, setData] = useState<RefereeAssignedMatchResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [timeframe, setTimeframe] = useState<"UPCOMING" | "PAST">("UPCOMING");

    const fetchMatches = useCallback(
        async (selectedTimeframe: "UPCOMING" | "PAST") => {
            setIsLoading(true);
            try {
                const response = await refereeMatchesApi.getAssignedMatches({
                    timeframe: selectedTimeframe,
                });
                if (response.result) {
                    setData(response.result);
                }
            } catch (error) {
                console.error("Lỗi khi tải lịch phân công trọng tài:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchMatches(timeframe);
    }, [timeframe, fetchMatches]);

    return {
        data,
        isLoading,
        timeframe,
        setTimeframe,
        refresh: () => fetchMatches(timeframe),
    };
};
