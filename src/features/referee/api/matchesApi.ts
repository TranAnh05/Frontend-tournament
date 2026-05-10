import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type RefereeAssignedMatchResponse,
    type RefereeMatchRequest,
} from "../types/matches";

export const refereeMatchesApi = {
    getAssignedMatches: (
        params: RefereeMatchRequest,
    ): Promise<ApiResponse<RefereeAssignedMatchResponse[]>> => {
        return api.get("/referee/matches", { params });
    },
};
