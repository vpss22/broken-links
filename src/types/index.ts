export interface LeadScore {
  score: number;
  tier: 'COLD' | 'WARM' | 'HOT';
  ai_insight?: string;
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

export interface ScanConfig {
  mode: 'manual' | 'ai';
  model: string;
  apiKey: string;
}
