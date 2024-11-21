export interface User {
  id: string;
  email: string;
}

export interface Content {
  id: number;
  prompt: string;
  generated_content: string;
  created_at: string;
  user_id: string;
  platforms: string; // Modificat pentru a stoca platformele ca string delimitat cu virgulă
}

export type SocialPlatform = 'facebook' | 'linkedin' | 'instagram' | 'twitter' | 'tiktok';

export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}