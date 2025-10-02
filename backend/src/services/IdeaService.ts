import { IdeaRepository } from '../repositories/IdeaRepository';
import { VoteRepository } from '../repositories/VoteRepository';
import { IdeaWithVoteCount } from '../models/Idea';
import { AppError } from '../middleware/errorHandler';
import { transaction } from '../utils/database';

export class IdeaService {
  private ideaRepository: IdeaRepository;
  private voteRepository: VoteRepository;

  constructor() {
    this.ideaRepository = new IdeaRepository();
    this.voteRepository = new VoteRepository();
  }

  /**
   * Получить все идеи с количеством голосов
   */
  async getAllIdeas(): Promise<IdeaWithVoteCount[]> {
    return await this.ideaRepository.findAll();
  }

  /**
   * Проголосовать за идею
   */
  async voteForIdea(ideaId: number, ipAddress: string): Promise<IdeaWithVoteCount> {
    // Проверяем, существует ли идея
    const idea = await this.ideaRepository.findById(ideaId);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }

    // Проверяем, не голосовал ли уже этот IP за данную идею
    const hasVoted = await this.voteRepository.hasVotedForIdea(ideaId, ipAddress);
    if (hasVoted) {
      throw new AppError('Already voted', 409);
    }

    // Проверяем лимит голосов (максимум 10)
    const voteCount = await this.voteRepository.getVoteCountByIP(ipAddress);
    if (voteCount >= 10) {
      throw new AppError('Vote limit exceeded', 409);
    }

    // Создаем голос в транзакции
    const updatedIdea = await transaction(async (client) => {
      await this.voteRepository.createVoteInTransaction(client, {
        idea_id: ideaId,
        ip_address: ipAddress,
      });

      // Получаем обновленную информацию об идее
      return await this.ideaRepository.findByIdWithVoteCount(ideaId);
    });

    if (!updatedIdea) {
      throw new AppError('Failed to update idea vote count', 500);
    }

    return updatedIdea;
  }

  /**
   * Получить список идей, за которые проголосовал IP
   */
  async getVotedIdeasByIP(ipAddress: string): Promise<number[]> {
    return await this.voteRepository.getVotedIdeasByIP(ipAddress);
  }
}