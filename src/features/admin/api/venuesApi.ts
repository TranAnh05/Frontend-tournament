import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type VenueResponse,
    type VenueFilterParams,
    type VenueRequest,
    type VenueStatusUpdateRequest,
} from "../types/venues";
import { type PageResponse } from "../types/Pagination";

export const venuesApi = {
    getVenues: (
        params?: VenueFilterParams,
    ): Promise<ApiResponse<PageResponse<VenueResponse>>> => {
        return api.get("/admin/venues", { params });
    },

    create: (data: VenueRequest): Promise<ApiResponse<VenueResponse>> => {
        return api.post("/admin/venues", data);
    },

    update: (
        id: number,
        data: VenueRequest,
    ): Promise<ApiResponse<VenueResponse>> => {
        return api.put(`/admin/venues/${id}`, data);
    },

    updateStatus: (
        id: number,
        data: VenueStatusUpdateRequest,
    ): Promise<ApiResponse<VenueResponse>> => {
        return api.patch(`/admin/venues/${id}/status`, data);
    },
};
