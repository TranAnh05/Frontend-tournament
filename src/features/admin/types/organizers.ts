export interface OrganizerResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null; 
  avatarUrl: string | null;  
  status: 'ACTIVE' | 'INACTIVE'; 
  createdAt: string;          
}

export interface OrganizerFilterParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface TournamentShortResponse {
  id: number;
  name: string;
  status: string; 
  startDate: string; 
  endDate: string;   
}

export interface AchievementDto {
  year: number;
  title: string;
  organization: string;
}

export interface OrganizerDetailResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;

  assignedAt: string | null;
  bio: string | null;
  achievements: AchievementDto[];

  totalTournaments: number;
  totalParticipatingClubs: number;

  recentTournaments: TournamentShortResponse[];
}