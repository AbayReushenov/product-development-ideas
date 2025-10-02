import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Idea, AppState } from './types';
import { ApiService } from './services/api';
import IdeaList from './components/IdeaList';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    ideas: [],
    votedIdeas: [],
    loading: true,
    error: null,
  });

  const canVote = state.votedIdeas.length < 10;

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [ideas, votedIdeas] = await Promise.all([
        ApiService.getIdeas(),
        ApiService.getMyVotes(),
      ]);

      setState(prev => ({
        ...prev,
        ideas,
        votedIdeas,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  const handleVoteSuccess = (ideaId: number, newVoteCount: number) => {
    setState(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea =>
        idea.id === ideaId ? { ...idea, vote_count: newVoteCount } : idea
      ),
      votedIdeas: [...prev.votedIdeas, ideaId],
    }));
  };

  const handleVoteError = (error: string) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  };

  const handleCloseError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const handleRetry = () => {
    loadData();
  };

  if (state.loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <LoadingSpinner size="lg" text="Загрузка идей..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <header className="text-center mb-5">
            <h1 className="display-4 mb-3">Идеи для изучения Английского языка</h1>
            <p className="lead text-muted">
              Голосуйте за самые интересные идеи для улучшения нашего продукта
            </p>
            <div className="alert alert-info">
              <strong>Информация:</strong> Вы можете проголосовать максимум за 10 идей.
              За одну идею можно проголосовать только один раз.
              <br />
              <small>
                Проголосовано: {state.votedIdeas.length}/10 идей
              </small>
            </div>
          </header>

          {state.error && (
            <div className="mb-4">
              <ErrorMessage message={state.error} onClose={handleCloseError} />
              <div className="text-center mt-3">
                <button className="btn btn-outline-primary" onClick={handleRetry}>
                  Попробовать снова
                </button>
              </div>
            </div>
          )}

          <IdeaList
            ideas={state.ideas}
            votedIdeas={state.votedIdeas}
            canVote={canVote}
            onVoteSuccess={handleVoteSuccess}
            onVoteError={handleVoteError}
          />

          {!canVote && (
            <div className="alert alert-warning mt-4">
              <strong>Лимит голосов достигнут!</strong> Вы уже проголосовали за максимальное количество идей (10).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
