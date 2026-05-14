import { useState, useEffect, useCallback } from 'react';
import { standingApi } from '../api/standingApi';
import { 
    type TournamentStandingResponse, 
    type TournamentLookupResponse 
} from '../types/standing';

// ========================================================
// HOOK 1: LẤY DANH SÁCH GIẢI ĐẤU (ĐỂ RENDER DROPDOWN/TABS)
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
// HOOK 2: LẤY CHI TIẾT BẢNG XẾP HẠNG CỦA 1 GIẢI ĐẤU CỤ THỂ
// ========================================================
export const useGetStandings = (tournamentId: number | undefined | null) => {
    const [data, setData] = useState<TournamentStandingResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStandings = useCallback(async (isBackgroundFetch = false) => {
        // Nếu chưa chọn giải đấu thì không gọi API và reset data
        if (!tournamentId || tournamentId <= 0) {
            setData(null);
            return;
        }

        // Tách biệt trạng thái UI: Tải ngầm vs Tải toàn trang
        if (isBackgroundFetch) {
            setIsFetching(true);
        } else {
            setIsLoading(true);
        }
        
        setError(null);

        try {
            const response = await standingApi.getTournamentStandings(tournamentId);
            setData(response.result);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [tournamentId]);

    // Gọi API mỗi khi ID giải đấu thay đổi
    useEffect(() => {
        fetchStandings(false); // false = tải toàn trang (hiển thị Spinner lớn)
    }, [fetchStandings]);

    // Hàm cung cấp ra ngoài để component chủ động gọi tải lại ngầm (khi nhấn nút Refresh)
    const refetch = useCallback(() => {
        fetchStandings(true); // true = tải ngầm (chỉ hiện spinner nhỏ)
    }, [fetchStandings]);

    return { data, isLoading, isFetching, error, refetch };
};