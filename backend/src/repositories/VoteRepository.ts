import { query, queryOne, transaction } from '../utils/database';
import { Vote, CreateVoteData } from '../models/Vote';

export class VoteRepository {
  /**
   * Создать голос
   */
  async create(voteData: CreateVoteData): Promise<Vote> {
    const sql = `
      INSERT INTO votes (idea_id, ip_address, voted_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    
    const result = await query<Vote>(sql, [voteData.idea_id, voteData.ip_address]);
    return result[0];
  }

  /**
   * Проверить, голосовал ли IP за данную идею
   */
  async hasVotedForIdea(ideaId: number, ipAddress: string): Promise<boolean> {
    const sql = 'SELECT id FROM votes WHERE idea_id = $1 AND ip_address = $2';
    const result = await queryOne<{ id: number }>(sql, [ideaId, ipAddress]);
    return result !== null;
  }

  /**
   * Получить количество голосов с данного IP
   */
  async getVoteCountByIP(ipAddress: string): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM votes WHERE ip_address = $1';
    const result = await queryOne<{ count: string }>(sql, [ipAddress]);
    return parseInt(result?.count || '0', 10);
  }

  /**
   * Получить список идей, за которые проголосовал IP
   */
  async getVotedIdeasByIP(ipAddress: string): Promise<number[]> {
    const sql = 'SELECT idea_id FROM votes WHERE ip_address = $1';
    const result = await query<{ idea_id: number }>(sql, [ipAddress]);
    return result.map(row => row.idea_id);
  }

  /**
   * Получить количество голосов для идеи
   */
  async getVoteCountForIdea(ideaId: number): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM votes WHERE idea_id = $1';
    const result = await queryOne<{ count: string }>(sql, [ideaId]);
    return parseInt(result?.count || '0', 10);
  }

  /**
   * Создать голос в транзакции
   */
  async createVoteInTransaction(
    client: any,
    voteData: CreateVoteData
  ): Promise<Vote> {
    const sql = `
      INSERT INTO votes (idea_id, ip_address, voted_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    
    const result = await client.query(sql, [voteData.idea_id, voteData.ip_address]);
    return result.rows[0];
  }
}