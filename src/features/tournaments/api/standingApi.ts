import api from '@/services/api';
import { type ApiResponse } from '@/types/api';
import { type TournamentLookupResponse, type TournamentStandingResponse } from '../types/standing';

export const standingApi = {
    /**
     * Lấy Bảng xếp hạng chi tiết của giải đấu dành cho Ban tổ chức
     * @param tournamentId ID của giải đấu
     */
    getTournamentStandings: (tournamentId: number): Promise<ApiResponse<TournamentStandingResponse>> => {
        return api.get(`/organizer/tournaments/${tournamentId}/standings`);
    },

    getStandingContextTournaments: (): Promise<ApiResponse<TournamentLookupResponse[]>> => {
        return api.get('/organizer/tournaments/standing-context');
    },
};