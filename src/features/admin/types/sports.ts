export interface RuleRequest {
  id?: number;
  ruleKey: string;
  ruleValue: string;
  description?: string;
}

export interface SportCreateRequest {
  name: string;
  description?: string;
  rules: RuleRequest[];
}

export interface RuleResponse {
  id: number;
  ruleKey: string;
  ruleValue: string;
  description: string;
}

export interface SportResponse {
  id: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  rules: RuleResponse[];
}

export interface SportFilterParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface SportUpdateRequest {
  name: string;
  description?: string;
  rules: RuleRequest[];
}

export interface StatusUpdateRequest {
  status: 'ACTIVE' | 'INACTIVE';
}