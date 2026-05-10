import api from '@/services/api';
import type { ApiResponse } from '@/types/api';

export interface ClubMemberInClub {
  memberId: number;
  athleteId: number;
  fullName: string;
  identityNumber: string;
  dateOfBirth: string;
  preferredNumber: number;
  preferredPosition: string;
  healthStatus: string;
  clubRole: string;
  joinStatus: string;
}

export interface TournamentHistoryResponse {
  tournamentId: number;
  tournamentName: string;
  season: string;
  registrationStatus: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  totalPoints: number;
  ranking: number | null;
}

export interface ClubResponse {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string | null;
  headquarters: string;
  homeVenueId: number | null;
  homeVenueName: string | null;
  contactEmail: string;
  contactPhone: string;
  status: string;
  managerName: string;
  members: ClubMemberInClub[];            
  tournamentHistory: TournamentHistoryResponse[];
}

export interface CreateClubRequest {
  name: string;
  shortName: string;
  headquarters?: string;
  homeVenueId?: number | null;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateClubRequest extends CreateClubRequest {}

export const clubApi = {
  createClub: async (data: CreateClubRequest): Promise<ClubResponse> => {
    const res = await api.post('/clubs', data);
    return (res as unknown as ApiResponse<ClubResponse>).result;
  },

  getMyClub: async (): Promise<ClubResponse> => {
    const res = await api.get('/clubs/me');
    return (res as unknown as ApiResponse<ClubResponse>).result;
  },

  updateClub: async (data: UpdateClubRequest): Promise<ClubResponse> => {
    const res = await api.put('/clubs/me', data);
    return (res as unknown as ApiResponse<ClubResponse>).result;
  },
};