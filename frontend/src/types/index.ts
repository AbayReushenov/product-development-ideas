export interface Idea {
  id: number;
  title: string;
  description: string;
  vote_count: number;
  created_at: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AppState {
  ideas: Idea[];
  votedIdeas: number[];
  loading: boolean;
  error: string | null;
}