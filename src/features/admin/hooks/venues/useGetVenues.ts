import { useState, useCallback } from 'react';
import { venuesApi } from '../../api/venuesApi';
import { type VenueResponse, type VenueFilterParams } from '../../types/venues';
import { type PageResponse } from '../../types/Pagination';

const defaultPageData: PageResponse<VenueResponse> = {
  content: [],
  currentPage: 0,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
};

export const useGetVenues = () => {
  const [data, setData] = useState<PageResponse<VenueResponse>>(defaultPageData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchVenues = useCallback(async (params?: VenueFilterParams) => {
    setIsLoading(true);
    try {
      const response = await venuesApi.getVenues(params);
      
      if (response.result) {
        setData(response.result);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm và sân thi đấu:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, fetchVenues };
};