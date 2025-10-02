import React, { useState } from 'react';
import { Idea } from '../types';
import { ApiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface IdeaCardProps {
  idea: Idea;
  isVoted: boolean;
  canVote: boolean;
  onVoteSuccess: (ideaId: number, newVoteCount: number) => void;
  onVoteError: (error: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isVoted,
  canVote,
  onVoteSuccess,
  onVoteError,
}) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (isVoting || isVoted || !canVote) return;

    setIsVoting(true);
    try {
      const response = await ApiService.voteForIdea(idea.id);
      onVoteSuccess(idea.id, response.vote_count);
    } catch (error: any) {
      onVoteError(error.message);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{idea.title}</h5>
        <p className="card-text flex-grow-1">{idea.description}</p>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              Создано: {formatDate(idea.created_at)}
            </small>
            <span className="badge bg-primary fs-6">
              {idea.vote_count} голосов
            </span>
          </div>
          
          <div className="d-grid">
            {isVoting ? (
              <LoadingSpinner size="sm" text="Голосование..." />
            ) : isVoted ? (
              <button className="btn btn-success" disabled>
                ✓ Вы проголосовали
              </button>
            ) : !canVote ? (
              <button className="btn btn-secondary" disabled>
                Лимит голосов исчерпан
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleVote}
                disabled={isVoting}
              >
                Проголосовать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;