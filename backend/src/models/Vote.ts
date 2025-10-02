export interface Vote {
  id: number;
  idea_id: number;
  ip_address: string;
  voted_at: Date;
}

export interface CreateVoteData {
  idea_id: number;
  ip_address: string;
}