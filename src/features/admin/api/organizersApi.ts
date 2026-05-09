import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type OrganizerResponse,
    type OrganizerFilterParams,
    type OrganizerDetailResponse,
    type OrganizerStatusUpdateRequest,
    type OrganizerStatusUpdateResponse,
} from "../types/organizers";
import { type PageResponse } from "../types/Pagination";

export const organizersApi = {
    getOrganizers: (
        params?: OrganizerFilterParams,
    ): Promise<ApiResponse<PageResponse<OrganizerResponse>>> => {
        return api.get("/admin/organizers", { params });
    },

    getDetail: (id: number): Promise<ApiResponse<OrganizerDetailResponse>> => {
        return api.get(`/admin/organizers/${id}`);
    },

    updateStatus: (
        id: number,
        data: OrganizerStatusUpdateRequest,
    ): Promise<ApiResponse<OrganizerStatusUpdateResponse>> => {
        return api.patch(`/admin/organizers/${id}/status`, data);
    },
};
