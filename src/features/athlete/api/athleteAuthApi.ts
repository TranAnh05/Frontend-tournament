import api from '@/services/api';
import type { AthleteRegisterRequest } from '../types';
import type { ApiResponse } from '@/types/api';

export const athleteAuthApi = {
  register: (data: AthleteRegisterRequest): Promise<ApiResponse<void>> => {
    return api.post('/athlete/register', data);
  },
};