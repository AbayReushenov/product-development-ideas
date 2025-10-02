import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IdeaService } from '../services/IdeaService';
import { ApiResponse, VoteResponse } from '../models/ApiResponse';
import { IdeaWithVoteCount } from '../models/Idea';

export class IdeaController {
  private ideaService: IdeaService;

  constructor() {
    this.ideaService = new IdeaService();
  }

  /**
   * GET /api/ideas - получить список всех идей
   */
  getIdeas: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ideas = await this.ideaService.getAllIdeas();
      
      const response: ApiResponse<IdeaWithVoteCount[]> = {
        success: true,
        data: ideas,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/ideas/:id/vote - проголосовать за идею
   */
  voteForIdea: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ideaId = parseInt(req.params.id, 10);
      const ipAddress = (req as any).clientIP as string;

      if (isNaN(ideaId)) {
        const errorResponse: ApiResponse = {
          success: false,
          error: 'Invalid idea ID',
          message: 'Idea ID must be a number',
        };
        res.status(400).json(errorResponse);
        return;
      }

      const updatedIdea = await this.ideaService.voteForIdea(ideaId, ipAddress);

      const response: ApiResponse<VoteResponse> = {
        success: true,
        data: {
          idea_id: updatedIdea.id,
          vote_count: updatedIdea.vote_count,
          message: 'Vote recorded successfully',
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/votes/my - получить список идей, за которые проголосовал текущий IP
   */
  getMyVotes: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = (req as any).clientIP as string;
      const votedIdeas = await this.ideaService.getVotedIdeasByIP(ipAddress);

      const response: ApiResponse<number[]> = {
        success: true,
        data: votedIdeas,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}