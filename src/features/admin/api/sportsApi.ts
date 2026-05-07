import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type SportCreateRequest,
    type SportFilterParams,
    type SportResponse,
    type SportUpdateRequest,
} from "../types/sports";
import type { PageResponse } from "../types/Pagination";

export const sportsApi = {
    getSports: (
        params?: SportFilterParams,
    ): Promise<ApiResponse<PageResponse<SportResponse>>> => {
        return api.get("/admin/sports", { params });
    },

    create: (data: SportCreateRequest): Promise<ApiResponse<SportResponse>> => {
        return api.post("/admin/sports", data);
    },

    update: (
        id: number,
        data: SportUpdateRequest,
    ): Promise<ApiResponse<SportResponse>> => {
        return api.put(`/admin/sports/${id}`, data);
    },
};
