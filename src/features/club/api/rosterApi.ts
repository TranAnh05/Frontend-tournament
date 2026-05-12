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
  // Nếu VĐV đang bị khóa ở giải khác, backend trả về 2 field này
  lockedInTournamentId?: number | null;
  lockedInTournamentName?: string | null;
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
    api.get(`/clubs/tournaments/${tournamentId}/roster`)
       .then((r: any) => r.result as RosterResponse),

  submitRoster: (tournamentId: number, players: RosterPlayerRequest[]) =>
    api.post(`/clubs/tournaments/${tournamentId}/roster`, { players })
       .then((r: any) => r.result as RosterResponse),
};