export interface ClubPublicResponse {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string | null;
  headquarters: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  managerName: string;
  homeVenueName: string | null;
  totalMembers: number;
}

export interface ClubMemberPublicResponse {
  athleteId: number;
  fullName: string;
  preferredNumber: number | null;
  preferredPosition: string | null;
  healthStatus: 'FIT' | 'INJURED';
  clubRole: 'MEMBER' | 'CAPTAIN' | 'HEAD_COACH';
}

export interface ClubPublicDetailResponse extends ClubPublicResponse {
  members: ClubMemberPublicResponse[];
}

export interface AthleteApplicationResponse {
  memberId: number;
  clubId: number;
  clubName: string;
  clubShortName: string;
  joinStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT' | 'REMOVED';
  clubRole: 'MEMBER' | 'CAPTAIN' | 'HEAD_COACH';
  appliedAt: string;
  joinedDate: string | null;
  leftDate: string | null;
}

export interface ApplyToClubRequest {
  clubId: number;
}

export interface AthleteProfileResponse {
  athleteId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  identityNumber: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  portraitUrl: string | null;
  preferredNumber: number | null;
  preferredPosition: string | null;
  healthStatus: 'FIT' | 'INJURED';
  currentClubName: string | null;
}

export interface UpdateAthleteProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  identityNumber?: string;
  dateOfBirth?: string; // "YYYY-MM-DD"
  preferredPosition?: string;
  preferredNumber?: number;
  portraitUrl?: string;
}

export interface AthleteRegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  identityNumber: string;
  dateOfBirth: string; // "YYYY-MM-DD"
}