import { useState, useCallback } from "react";
import { organizersApi } from "../../api/organizersApi";
import {
    type OrganizerResponse,
    type OrganizerFilterParams,
} from "../../types/organizers";
import { type PageResponse } from "../../types/Pagination";

const defaultPageData: PageResponse<OrganizerResponse> = {
    content: [],
    currentPage: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
};

export const useGetOrganizers = () => {
    const [data, setData] =
        useState<PageResponse<OrganizerResponse>>(defaultPageData);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchOrganizers = useCallback(
        async (params?: OrganizerFilterParams) => {
            setIsLoading(true);
            try {
                const response = await organizersApi.getOrganizers(params);

                if (response.result) {
                    setData(response.result);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách Ban tổ chức:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    return {
        data,
        isLoading,
        fetchOrganizers,
    };
};
