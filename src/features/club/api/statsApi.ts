import api from '@/services/api';
import type { ApiResponse } from '@/types/api';

export interface StandingResponse {
  clubId: number;
  clubName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  scoresFor: number;
  scoresAgainst: number;
  scoreDifference: number;
  totalPoints: number;
}

export interface PlayerStatResponse {
  athleteId: number;
  fullName: string;
  jerseyNumber: number;
  position: string;
  matchesPlayed: number;
  scores: number;
  assists: number;
  fouls: number;
  mvpCount: number;
  rosterStatus: string;
}

export interface DisciplineResponse {
  id: number;
  disciplineType: string;
  reason: string;
  fineAmount: number;
  suspensionDuration: number | null;
  status: string;
  createdAt: string;
  athleteName: string | null;
}

export const statsApi = {
  getStandings: async (tournamentId: number): Promise<StandingResponse[]> => {
    const res = await api.get(`/tournaments/${tournamentId}/standings`);
    return (res as unknown as ApiResponse<StandingResponse[]>).result;
  },

  getPlayerStats: async (tournamentId: number): Promise<PlayerStatResponse[]> => {
    const res = await api.get(`/tournaments/${tournamentId}/stats/my`);
    return (res as unknown as ApiResponse<PlayerStatResponse[]>).result;
  },

  getDisciplines: async (): Promise<DisciplineResponse[]> => {
    const res = await api.get('/clubs/me/disciplines');
    return (res as unknown as ApiResponse<DisciplineResponse[]>).result;
  },
};