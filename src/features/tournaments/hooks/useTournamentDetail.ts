// src/features/tournaments/hooks/useTournamentDetail.ts
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tournamentApi } from '../api/tournamentApi';
import type { TournamentDetail } from '../types'; // Đảm bảo đã export interface này

export const useTournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // 1. Khai báo state với kiểu TournamentDetail
  const [data, setData] = useState<TournamentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // 2. Ép kiểu response về any để truy cập trường 'result'
        // Hoặc dùng: const response = await tournamentApi.getById(Number(id)) as any;
        const response: any = await tournamentApi.getTournamentById(Number(id));
        
        // 3. Lấy dữ liệu từ trường 'result' do Backend bọc lại
        const result = response.result || response.data?.result;
        
        if (result) {
          setData(result as TournamentDetail);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết giải đấu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // Trả về data đã được định nghĩa kiểu
  return { data, loading };
};