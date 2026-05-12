import athleteApi from '@/services/athleteApi';
import type { AthleteRegisterRequest } from '../types';
import type { ApiResponse } from '@/types/api';

export const athleteAuthApi = {
  register: (data: AthleteRegisterRequest): Promise<ApiResponse<void>> => {
    return athleteApi.post('/athlete/register', data);
  },
};
