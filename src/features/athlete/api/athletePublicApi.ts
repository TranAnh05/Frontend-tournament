import api from '@/services/api';
import type { ApiResponse } from '@/types/api';
import type {
  ClubPublicResponse, ClubPublicDetailResponse,
  AthleteApplicationResponse, ApplyToClubRequest,
} from '../types';

export const athletePublicApi = {
  getAllClubs: async (): Promise<ClubPublicResponse[]> => {
    const res = await api.get('/athlete/clubs');
    return (res as unknown as ApiResponse<ClubPublicResponse[]>).result;
  },

  getClubDetail: async (clubId: number): Promise<ClubPublicDetailResponse> => {
    const res = await api.get(`/athlete/clubs/${clubId}`);
    return (res as unknown as ApiResponse<ClubPublicDetailResponse>).result;
  },

  applyToClub: async (data: ApplyToClubRequest): Promise<AthleteApplicationResponse> => {
    const res = await api.post('/athlete/clubs/apply', data);
    return (res as unknown as ApiResponse<AthleteApplicationResponse>).result;
  },

  getMyApplications: async (): Promise<AthleteApplicationResponse[]> => {
    const res = await api.get('/athlete/my-applications');
    return (res as unknown as ApiResponse<AthleteApplicationResponse[]>).result;
  },
};