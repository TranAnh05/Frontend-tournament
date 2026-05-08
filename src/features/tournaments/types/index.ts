export type TournamentStatus = 'DRAFT' | 'PUBLISHED' | 'OPENING' | 'IN_PROGRESS' | 'COMPLETED' | 'REGISTRATION_CLOSED';
export type TournamentFormat = 'SINGLE_ELIMINATION' | 'ROUND_ROBIN' | 'DOUBLE_ELIMINATION';

export interface Tournament {
  id: number;
  name: string;
  sportName: string;
  startDate: string;
  endDate: string;
  venueName: string;
  status: TournamentStatus;
  format: TournamentFormat;
  maxAthletes: number;
}