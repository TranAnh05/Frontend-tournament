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