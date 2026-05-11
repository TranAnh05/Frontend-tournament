import api from '@/services/api';
import type { ApiResponse } from '@/types/api';

export interface TournamentResponse {
  id: number;
  name: string;
  sportId: number;
  sportName: string;
  venueId: number;
  venueName: string;
  startDate: string;
  endDate: string;
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  minAthletes: number;
  maxAthletes: number;
  format: string;
  status: string;
}

export interface RegistrationResponse {
  id: number;
  tournamentId: number;
  clubId: number;
  tournamentName: string; 
  status: string;
  homeKitColor: string;
  awayKitColor: string;
  appliedAt: string;
  reviewedAt: string | null;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const tournamentApi = {
  getAllTournaments: async (): Promise<TournamentResponse[]> => {
    const res = await api.get('/tournaments');
    const page = res as unknown as PageResponse<TournamentResponse>;
    return page.content ?? [];
  },

  getMyRegistrations: async (): Promise<RegistrationResponse[]> => {
    const res = await api.get('/tournaments/registrations/my');
    return (res as unknown as ApiResponse<RegistrationResponse[]>).result ?? [];
  },

  register: async (tournamentId: number, data: {
    homeKitColor: string;
    awayKitColor: string;
    financialProofUrl: string;
  }): Promise<RegistrationResponse> => {
    const res = await api.post(`/tournaments/${tournamentId}/register`, data);
    return (res as unknown as ApiResponse<RegistrationResponse>).result;
  },

  withdraw: async (tournamentId: number): Promise<void> => {
    await api.delete(`/tournaments/${tournamentId}/withdraw`);
  },

  submitRoster: async (tournamentId: number, data: {
    rosters: { athleteId: number; jerseyNumber: number; position: string; role: string }[]
  }): Promise<void> => {
    const res = await api.post(`/tournaments/${tournamentId}/roster`, data);
    const response = res as unknown as ApiResponse<void>;
    if (response.code !== 200) {
      throw new Error(response.message || 'Nộp danh sách thất bại');
    }
  },

  hasRoster: async (tournamentId: number): Promise<boolean> => {
    const res = await api.get(`/tournaments/${tournamentId}/roster/status`);
    return (res as unknown as ApiResponse<boolean>).result ?? false;
  },
};