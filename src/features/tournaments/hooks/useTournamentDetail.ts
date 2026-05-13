// src/features/tournaments/hooks/useTournamentDetail.ts
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tournamentApi } from '../api/tournamentApi';
import type { TournamentDetail } from '../types'; // Đảm bảo đã export interface này

export const useTournamentDetail = (id: number | string | undefined | null) => {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✨ LỚP BẢO VỆ TUYỆT ĐỐI: 
    // Nếu id là undefined (lúc mới load), hoặc NaN, hoặc null -> Lập tức dừng lại, không gọi API!
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await tournamentApi.getTournamentById(Number(id));
       
        setDetail(res.result);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết giải đấu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]); // Hook chỉ chạy lại khi giá trị 'id' thay đổi

  return { detail, loading };
};