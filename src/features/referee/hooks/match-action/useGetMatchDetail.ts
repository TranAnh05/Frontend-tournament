/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useCallback, useEffect } from "react";
import { matchActionApi } from "../../api/matchActionApi";
import { type MatchDetailResponse } from "../../types/matchAction";

export const useGetMatchDetail = (matchId: number) => {
    const [data, setData] = useState<MatchDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchMatchDetail = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await matchActionApi.getMatchDetail(matchId);
            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error("Lỗi khi tải chi tiết trận đấu:", error);
        } finally {
            setIsLoading(false);
        }
    }, [matchId]);

    useEffect(() => {
        if (matchId) {
            fetchMatchDetail();
        }
    }, [matchId, fetchMatchDetail]);

    return { data, isLoading, refetch: fetchMatchDetail };
};
