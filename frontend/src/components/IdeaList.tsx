import React from 'react';
import { Idea } from '../types';
import IdeaCard from './IdeaCard';

interface IdeaListProps {
  ideas: Idea[];
  votedIdeas: number[];
  canVote: boolean;
  onVoteSuccess: (ideaId: number, newVoteCount: number) => void;
  onVoteError: (error: string) => void;
}

const IdeaList: React.FC<IdeaListProps> = ({
  ideas,
  votedIdeas,
  canVote,
  onVoteSuccess,
  onVoteError,
}) => {
  if (ideas.length === 0) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Идеи не найдены</h4>
        <p className="text-muted">Попробуйте обновить страницу</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {ideas.map((idea) => (
        <div key={idea.id} className="col-lg-6 col-xl-4">
          <IdeaCard
            idea={idea}
            isVoted={votedIdeas.includes(idea.id)}
            canVote={canVote}
            onVoteSuccess={onVoteSuccess}
            onVoteError={onVoteError}
          />
        </div>
      ))}
    </div>
  );
};

export default IdeaList;