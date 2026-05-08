import type { ApiResponse } from '@/types/api';
import { type Tournament, type TournamentDetail } from '../types';
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
  // xem toàn bộ thông tin giải
  getTournamentById: (id: string | number): Promise<ApiResponse<TournamentDetail>>  => {
    return api.get(`/tournaments/${id}`);
  },
  // Xóa giải đấu
  deleteTournament: (id: number) => {
    return api.delete(`/tournaments/${id}`);
  }
};