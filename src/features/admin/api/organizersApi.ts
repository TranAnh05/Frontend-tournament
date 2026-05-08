import api from "@/services/api";
import { type ApiResponse } from "@/types/api";
import {
    type OrganizerResponse,
    type OrganizerFilterParams,
} from "../types/organizers";
import { type PageResponse } from "../types/Pagination";

export const organizersApi = {
    getOrganizers: (
        params?: OrganizerFilterParams,
    ): Promise<ApiResponse<PageResponse<OrganizerResponse>>> => {
        return api.get("/admin/organizers", { params });
    },
};
