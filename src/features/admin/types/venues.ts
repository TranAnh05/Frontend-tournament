export interface SportBasicResponse {
  id: number;
  name: string;
}

export interface CourtResponse {
  id: number;
  courtName: string;
  status: 'ACTIVE' | 'MAINTENANCE'; 
  supportedSports: SportBasicResponse[];
}

export interface VenueResponse {
  id: number;
  name: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  courts: CourtResponse[];
}

export interface VenueFilterParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}


export interface CourtRequest {
  id?: number; 
  courtName: string;
  status?: 'ACTIVE' | 'MAINTENANCE';
  supportedSportIds: number[]; 
}

export interface VenueRequest {
  name: string;
  address: string;
  courts: CourtRequest[];
}

export interface VenueStatusUpdateRequest {
  status: 'ACTIVE' | 'INACTIVE';
}