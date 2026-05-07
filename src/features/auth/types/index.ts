export type Role = 'ROLE_ADMIN' | 'ROLE_ORGANIZER' | 'ROLE_CLUB' | 'ROLE_REFEREE' | 'ROLE_ATHLETE';

export interface AuthUser {
  email: string;
  fullName: string;
  roles: string[]; 
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}
