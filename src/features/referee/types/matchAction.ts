export interface PlayerDto {
  lineupId: number;
  athleteId: number;
  fullName: string;
  identityNumber: string;
  portraitUrl: string | null;
  jerseyNumber: number | null;
  position: string | null;
  isConfirmed: boolean;
}

export interface TeamLineupDto {
  clubId: number;
  clubName: string;
  logoUrl: string | null;
  currentScore: number;
  startingPlayers: PlayerDto[];
  substitutePlayers: PlayerDto[];
}

export interface MatchDetailResponse {
  matchId: number;
  tournamentName: string;
  sportName: string;
  scheduledTime: string;
  location: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED' | 'CANCELED';
  sportRules: Record<string, string>;
  homeTeam: TeamLineupDto;
  awayTeam: TeamLineupDto;
}

export interface ConfirmLineupRequest {
  lineupIds: number[];
}