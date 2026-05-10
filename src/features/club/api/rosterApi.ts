import api from "@/services/api";

export interface RosterPlayer {
  rosterId: number;
  athleteId: number;
  fullName: string;
  jerseyNumber: number;
  position: string;
  role: string;
  status: string;
  healthStatus: string;
}

export interface RosterResponse {
  tournamentId: number;
  tournamentName: string;
  players: RosterPlayer[];
}

export interface RosterPlayerRequest {
  athleteId: number;
  jerseyNumber?: number;
  position?: string;
  role?: string;
}

export const rosterApi = {
  getMyRoster: (tournamentId: number) =>
    api.get<{ result: RosterResponse }>(`/clubs/tournaments/${tournamentId}/roster`)
       .then(r => r.data.result),

  submitRoster: (tournamentId: number, players: RosterPlayerRequest[]) =>
    api.post<{ result: RosterResponse }>(`/clubs/tournaments/${tournamentId}/roster`, { players })
       .then(r => r.data.result),
};