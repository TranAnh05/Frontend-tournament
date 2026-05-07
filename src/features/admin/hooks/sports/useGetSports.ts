import { useState, useCallback } from "react";
import { sportsApi } from "../../api/sportsApi";
import { type SportFilterParams, type SportResponse } from "../../types/sports";
import type { PageResponse } from "../../types/Pagination";

const defaultPageData: PageResponse<SportResponse> = {
    content: [],
    currentPage: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
};

export const useGetSports = () => {
    const [data, setData] =
        useState<PageResponse<SportResponse>>(defaultPageData);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchSports = useCallback(async (params?: SportFilterParams) => {
        setIsLoading(true);
        try {
            const response = await sportsApi.getSports(params);

            if (response.result) {
                setData(response.result);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách môn thể thao:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, fetchSports };
};
