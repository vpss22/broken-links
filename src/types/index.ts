export interface LeadScore {
  score: number;
  tier: 'COLD' | 'WARM' | 'HOT';
}

export interface Lead {
  name: string;
  instagram_status: string;
  linktree: boolean;
  inactive: boolean;
  subscribers: number;
  score: LeadScore;
}

export interface ScanResponse {
  leads: Lead[];
}
