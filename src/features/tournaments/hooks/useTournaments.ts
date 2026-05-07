import { useState, useEffect, useCallback } from 'react';
import { tournamentApi } from '../api/tournamentApi';
import type { Tournament } from '../types';

export const useTournaments = () => {
 const [data, setData] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    search: ''
  });

 // Thêm kiểm tra an toàn bằng dấu ?
const fetchTournaments = useCallback(async () => {
  setLoading(true);
  try {
    const response: any = await tournamentApi.getTournaments(queryParams);
    
    
    // Vì log của Trung cho thấy response đã là object chứa content
    // Nên chúng ta lấy trực tiếp luôn:
    if (response) {
      setData(response.content || []); 
      setTotal(response.totalElements || 0);
    }
    
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
  } finally {
    setLoading(false);
  }
}, [queryParams]);
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { 
    data, 
    loading, 
    total, 
    queryParams, 
    setQueryParams, 
    refresh: fetchTournaments 
  };
};