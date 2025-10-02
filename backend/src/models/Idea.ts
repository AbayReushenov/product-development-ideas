export interface Idea {
  id: number;
  title: string;
  description: string;
  vote_count: number;
  created_at: Date;
}

export interface CreateIdeaData {
  title: string;
  description: string;
}

export interface IdeaWithVoteCount extends Idea {
  vote_count: number;
}