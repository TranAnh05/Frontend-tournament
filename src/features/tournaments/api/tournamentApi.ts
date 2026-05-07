import type { ApiResponse } from '@/types/api';
import { type Tournament } from '../types';
import api from '@/services/api';

export const tournamentApi = {
  // Lấy danh sách giải đấu có phân trang và filter
  getTournaments: (params?: any) => {
    return api.get('/tournaments', { params: {
        page: params.page,
        size: params.size,
        name: params.search, // Gửi từ khóa search lên params 'name' cho Backend
        sort: 'id,desc'
      } });
  },
  
  // Xóa giải đấu
  deleteTournament: (id: number) => {
    return api.delete(`/tournaments/${id}`);
  }
};