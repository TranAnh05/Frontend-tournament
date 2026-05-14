/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { standingApi } from "../api/standingApi";
import {
    type TournamentStandingResponse,
    type TournamentLookupResponse,
    type OverallStandingResponse, // 🌟 Thêm import
} from "../types/standing";

// ========================================================
// HOOK 1: LẤY DANH SÁCH GIẢI ĐẤU (ĐỂ RENDER TABS CHỌN)
// ========================================================
export const useGetStandingContext = () => {
    const [data, setData] = useState<TournamentLookupResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchContextTournaments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await standingApi.getStandingContextTournaments();
            setData(response.result);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContextTournaments();
    }, [fetchContextTournaments]);

    return { data, isLoading, error, refetch: fetchContextTournaments };
};

// ========================================================
// HOOK 2: LẤY XẾP HẠNG THEO BẢNG ĐẤU (GROUP STANDINGS)
// ========================================================
export const useGetStandings = (tournamentId: number | undefined | null) => {
    const [data, setData] = useState<TournamentStandingResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStandings = useCallback(
        async (isBackgroundFetch = false) => {
            if (!tournamentId || tournamentId <= 0) {
                setData(null);
                return;
            }

            if (isBackgroundFetch) setIsFetching(true);
            else setIsLoading(true);

            setError(null);

            try {
                const response =
                    await standingApi.getTournamentStandings(tournamentId);
                setData(response.result);
            } catch (err: any) {
                setError(err);
            } finally {
                setIsLoading(false);
                setIsFetching(false);
            }
        },
        [tournamentId],
    );

    useEffect(() => {
        fetchStandings(false);
    }, [fetchStandings]);

    const refetch = useCallback(() => {
        fetchStandings(true);
    }, [fetchStandings]);

    return { data, isLoading, isFetching, error, refetch };
};

// ========================================================
// 🌟 HOOK 3 (THÊM MỚI): LẤY BẢNG TỔNG SẮP CHUNG CUỘC
// ========================================================
export const useGetOverallStandings = (
    tournamentId: number | undefined | null,
) => {
    const [data, setData] = useState<OverallStandingResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchOverall = useCallback(
        async (isBackgroundFetch = false) => {
            if (!tournamentId || tournamentId <= 0) {
                setData(null);
                return;
            }

            if (isBackgroundFetch) setIsFetching(true);
            else setIsLoading(true);

            setError(null);

            try {
                const response =
                    await standingApi.getOverallStandings(tournamentId);
                setData(response.result);
            } catch (err: any) {
                setError(err);
            } finally {
                setIsLoading(false);
                setIsFetching(false);
            }
        },
        [tournamentId],
    );

    useEffect(() => {
        fetchOverall(false);
    }, [fetchOverall]);

    const refetch = useCallback(() => {
        fetchOverall(true);
    }, [fetchOverall]);

    return { data, isLoading, isFetching, error, refetch };
};
