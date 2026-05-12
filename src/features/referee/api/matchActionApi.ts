import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type ChangeMatchStatusRequest,
    type ConfirmLineupRequest,
    type CreateMatchEventRequest,
    type FinalizeMatchRequest,
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

    changeMatchStatus: (
        matchId: number,
        data: ChangeMatchStatusRequest,
    ): Promise<ApiResponse<string>> => {
        return api.patch(`/referee/matches/${matchId}/status`, data);
    },

    createEvent: (
        matchId: number,
        data: CreateMatchEventRequest,
    ): Promise<ApiResponse<string>> => {
        return api.post(`/referee/matches/${matchId}/events`, data);
    },

    finalizeMatch: (matchId: number, data: FinalizeMatchRequest): Promise<ApiResponse<string>> => {
        return api.post(`/referee/matches/${matchId}/finalize`, data);
    }
};
