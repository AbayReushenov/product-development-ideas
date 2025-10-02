import { query, queryOne } from '../utils/database';
import { Idea, CreateIdeaData, IdeaWithVoteCount } from '../models/Idea';

export class IdeaRepository {
  /**
   * Получить все идеи с количеством голосов
   */
  async findAll(): Promise<IdeaWithVoteCount[]> {
    const sql = `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.created_at,
        COALESCE(COUNT(v.id), 0) as vote_count
      FROM ideas i
      LEFT JOIN votes v ON i.id = v.idea_id
      GROUP BY i.id, i.title, i.description, i.created_at
      ORDER BY vote_count DESC, i.created_at DESC
    `;
    
    return await query<IdeaWithVoteCount>(sql);
  }

  /**
   * Получить идею по ID
   */
  async findById(id: number): Promise<Idea | null> {
    const sql = 'SELECT * FROM ideas WHERE id = $1';
    return await queryOne<Idea>(sql, [id]);
  }

  /**
   * Создать новую идею
   */
  async create(ideaData: CreateIdeaData): Promise<Idea> {
    const sql = `
      INSERT INTO ideas (title, description, created_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    
    const result = await query<Idea>(sql, [ideaData.title, ideaData.description]);
    return result[0];
  }

  /**
   * Обновить количество голосов для идеи
   */
  async updateVoteCount(id: number, voteCount: number): Promise<void> {
    const sql = 'UPDATE ideas SET vote_count = $1 WHERE id = $2';
    await query(sql, [voteCount, id]);
  }

  /**
   * Получить идею с количеством голосов
   */
  async findByIdWithVoteCount(id: number): Promise<IdeaWithVoteCount | null> {
    const sql = `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.created_at,
        COALESCE(COUNT(v.id), 0) as vote_count
      FROM ideas i
      LEFT JOIN votes v ON i.id = v.idea_id
      WHERE i.id = $1
      GROUP BY i.id, i.title, i.description, i.created_at
    `;
    
    return await queryOne<IdeaWithVoteCount>(sql, [id]);
  }
}