import api from '@/services/api';
import type { ApiResponse } from '@/types/api';

export interface MatchEventResponse {
  id: number;
  eventType: string;
  eventTime: string;
  primaryAthleteName: string | null;
  clubId: number;
}

export interface MatchResponse {
  id: number;
  tournamentId: number;
  tournamentName: string;
  groupStageName: string;
  homeClubId: number;
  homeClubName: string;
  homeClubShortName: string;
  awayClubId: number;
  awayClubName: string;
  awayClubShortName: string;
  scheduledTime: string;
  status: string;
  homeScore: number;
  awayScore: number;
  events: MatchEventResponse[];
  hasLineup?: boolean; // BE trả về nếu CLB đã nộp đội hình
}

export const matchApi = {
  getMyMatches: async (): Promise<MatchResponse[]> => {
    const res = await api.get('/matches/my');
    return (res as unknown as ApiResponse<MatchResponse[]>).result;
  },

  submitLineup: async (matchId: number, lineup: { athleteId: number; lineupType: string; jerseyNumber: number; position: string }[]): Promise<void> => {
    await api.post(`/matches/${matchId}/lineup`, { lineups: lineup });
  },
};