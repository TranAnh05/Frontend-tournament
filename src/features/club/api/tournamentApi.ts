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
  status: string;
  homeKitColor: string;
  awayKitColor: string;
  appliedAt: string;
  reviewedAt: string | null;
}

export const tournamentApi = {
  getAllTournaments: async (): Promise<TournamentResponse[]> => {
    const res = await api.get('/tournaments');
    return (res as unknown as ApiResponse<TournamentResponse[]>).result;
  },

  getMyRegistrations: async (): Promise<RegistrationResponse[]> => {
    const res = await api.get('/tournaments/registrations/my');
    return (res as unknown as ApiResponse<RegistrationResponse[]>).result;
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
};