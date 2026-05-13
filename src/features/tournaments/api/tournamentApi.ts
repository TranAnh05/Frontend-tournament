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

  create: (data: any) => api.post('/tournaments', data),
  getSports: () => api.get('/tournaments/sports/all'),
  getVenues: () => api.get('/tournaments/venues/all'),
  update: (id: number, data: any) => api.put(`/tournaments/${id}`, data),
  // Xóa giải đấu
  deleteTournament: (id: number) => {
    return api.delete(`/tournaments/${id}`);
  },
  toggleRegistration: (id: number) => api.patch(`/tournaments/${id}/registration`),

  startTournament: (id: number) => api.patch(`/tournaments/${id}/start`),
  finishTournament: (id: number) => api.patch(`/tournaments/${id}/finish`),
   getReadyForGrouping: (page: number, size: number) => 
    api.get(`/tournaments/ready-for-grouping`, { params: { page, size } }),
   
// ✨ 1. Lấy danh sách các bảng đấu sau khi bốc thăm
  getGroupsByTournament: (tournamentId: number | string) => {
    // Lưu ý: Đổi `axiosClient` thành biến instance axios thực tế của bạn (ví dụ: api, axiosInstance...)
    return api.get(`/tournaments/${tournamentId}/groups`);
  },

  // ✨ 2. Thực thi lệnh bốc thăm chia bảng
  executeGroupDraw: (tournamentId: number | string, data: { numberOfGroups: number }) => {
    return api.post(`/tournaments/${tournamentId}/draw`, data);
  }
};
export const registrationApi = {
  // Lấy danh sách giải đang mở đăng ký
  getOpeningTournaments: () => 
    api.get('/tournaments/opening'),
  getRegistrationDetail: (tournamentId: number, regId: number) => 
    api.get(`/tournaments/${tournamentId}/registrations/${regId}`),

  // Lấy danh sách đội đăng ký của 1 giải
  getRegistrations: (tournamentId: number, params?: any) => 
    api.get(`/tournaments/${tournamentId}/registrations`, { params }),
    
  // (Chuẩn bị sẵn cho bước sau)
  approveRegistration: (tournamentId: number, regId: number) => 
    api.patch(`/tournaments/${tournamentId}/registrations/${regId}/approve`),
    
  rejectRegistration: (tournamentId: number, regId: number, reason: string) => 
    api.patch(`/tournaments/${tournamentId}/registrations/${regId}/reject`, { reason }),
 

};