export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VoteResponse {
  idea_id: number;
  vote_count: number;
  message: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}