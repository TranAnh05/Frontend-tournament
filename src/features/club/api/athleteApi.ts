import api from '@/services/api';
import type { ApiResponse } from '@/types/api';

export interface ClubMemberResponse {
  memberId: number;
  athleteId: number;
  userId: number;
  fullName: string;
  email: string;
  identityNumber: string;
  dateOfBirth: string;
  preferredNumber: number;
  preferredPosition: string;
  healthStatus: 'FIT' | 'INJURED';
  clubRole: 'MEMBER' | 'CAPTAIN' | 'HEAD_COACH';
  joinStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT' | 'REMOVED';
  joinedDate: string | null;
  leftDate: string | null;
}

export interface UpdateAthleteRequest {
  preferredNumber?: number;
  preferredPosition?: string;
  healthStatus?: 'FIT' | 'INJURED';
  clubRole?: 'MEMBER' | 'CAPTAIN' | 'HEAD_COACH';
}

export const athleteApi = {
  getMembers: async (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT' | 'REMOVED' = 'APPROVED'): Promise<ClubMemberResponse[]> => {
    const res = await api.get('/clubs/me/members', { params: { status } });
    return (res as unknown as ApiResponse<ClubMemberResponse[]>).result;
  },

  approveMember: async (memberId: number, approved: boolean, rejectReason?: string): Promise<ClubMemberResponse> => {
    if (!approved && (!rejectReason || rejectReason.trim() === '')) {
      throw new Error('Vui lòng cung cấp lý do từ chối');
    }
    const res = await api.patch(`/clubs/me/members/${memberId}/approve`, {
      approved,
      rejectReason: rejectReason || null,
    });
    return (res as unknown as ApiResponse<ClubMemberResponse>).result;
  },

  updateAthlete: async (memberId: number, data: UpdateAthleteRequest): Promise<ClubMemberResponse> => {
    const res = await api.put(`/clubs/me/members/${memberId}`, data);
    return (res as unknown as ApiResponse<ClubMemberResponse>).result;
  },

  removeMember: async (memberId: number): Promise<void> => {
    await api.delete(`/clubs/me/members/${memberId}`);
  },

  assignRole: async (memberId: number, clubRole: 'MEMBER' | 'CAPTAIN' | 'HEAD_COACH'): Promise<ClubMemberResponse> => {
    const res = await api.patch(`/clubs/me/members/${memberId}/role`, { clubRole });
    return (res as unknown as ApiResponse<ClubMemberResponse>).result;
  },
};