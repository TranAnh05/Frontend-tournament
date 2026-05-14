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
export interface Court {
  id: number;
  name: string;
}

export interface VenueDetail {
  id: number;
  name: string;
  address: string;
  courts: Court[];
}

export interface TournamentDetail {
  id: number;
  name: string;
  sportName: string;
  startDate: string;
  endDate: string;
  winPoints: number;
  drawPoints: number;
  lostPonits: number;
  format: string;
  status: string;
  maxAthletes: number;
  minAthletes: number;
  venue: VenueDetail; // Bọc toàn bộ Venue và Courts
  createdAt: string;
  updatedAt: string;
}
export interface TournamentUpdateRequest {
 id: number;
  name: string;
  sportName: string;
  startDate: string;
  endDate: string;
  winPoints: number;
  drawPoints: number;
  lostPonits: number;
  format: string;
  status: string;
  maxAthletes: number;
  minAthletes: number;
  venue: VenueDetail; // Bọc toàn bộ Venue và Courts
  createdAt: string;
  updatedAt: string;
}

export interface AssignRefereeRequest {
  refereeId: number | string;
  role?: string; // Không bắt buộc, backend đã set mặc định là MAIN
}
// Định nghĩa cấu trúc request gửi lên Backend
export interface FirstKnockoutRoundRequest {
  qualifiedClubIds: number[];
}