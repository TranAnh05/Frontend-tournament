import athleteApi from '@/services/athleteApi';
import type { ApiResponse } from '@/types/api';
import type {
  ClubPublicResponse, ClubPublicDetailResponse,
  AthleteApplicationResponse, ApplyToClubRequest,
  AthleteProfileResponse, UpdateAthleteProfileRequest,
  AthleteRegisterRequest,
} from '../types';

export const athletePublicApi = {
  getAllClubs: async (): Promise<ClubPublicResponse[]> => {
    const res = await athleteApi.get('/athlete/clubs');
    return (res as unknown as ApiResponse<ClubPublicResponse[]>).result;
  },

  getClubDetail: async (clubId: number): Promise<ClubPublicDetailResponse> => {
    const res = await athleteApi.get(`/athlete/clubs/${clubId}`);
    return (res as unknown as ApiResponse<ClubPublicDetailResponse>).result;
  },

  applyToClub: async (data: ApplyToClubRequest): Promise<AthleteApplicationResponse> => {
    const res = await athleteApi.post('/athlete/clubs/apply', data);
    return (res as unknown as ApiResponse<AthleteApplicationResponse>).result;
  },

  getMyApplications: async (): Promise<AthleteApplicationResponse[]> => {
    const res = await athleteApi.get('/athlete/my-applications');
    return (res as unknown as ApiResponse<AthleteApplicationResponse[]>).result;
  },

  getMyProfile: async (): Promise<AthleteProfileResponse> => {
    const res = await athleteApi.get('/athlete/my-profile');
    return (res as unknown as ApiResponse<AthleteProfileResponse>).result;
  },

  updateMyProfile: async (data: UpdateAthleteProfileRequest): Promise<AthleteProfileResponse> => {
    const res = await athleteApi.put('/athlete/my-profile', data);
    return (res as unknown as ApiResponse<AthleteProfileResponse>).result;
  },

  register: async (data: AthleteRegisterRequest): Promise<void> => {
    await athleteApi.post('/athlete/register', data);
  },
};