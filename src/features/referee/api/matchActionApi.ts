import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type ConfirmLineupRequest,
    type MatchDetailResponse,
} from "../types/matchAction";

export const matchActionApi = {
    getMatchDetail: (
        matchId: number,
    ): Promise<ApiResponse<MatchDetailResponse>> => {
        return api.get(`/referee/matches/${matchId}`);
    },

    confirmLineups: (
        matchId: number,
        data: ConfirmLineupRequest,
    ): Promise<ApiResponse<string>> => {
        return api.patch(`/referee/matches/${matchId}/lineup-confirm`, data);
    },
};
