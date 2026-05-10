export interface RefereeMatchRequest {
  timeframe: 'UPCOMING' | 'PAST';
}

export interface MatchClubDto {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string | null;
  score: number | null; 
}

export interface RefereeAssignedMatchResponse {
  matchId: number;
  tournamentName: string;
  scheduledTime: string; 
  location: string;
  matchStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED' | 'CANCELED';
  refereeRole: 'MAIN' | 'ASSISTANT' | 'FOURTH' | 'TABLE';
  homeTeam: MatchClubDto;
  awayTeam: MatchClubDto;
}