import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

/**
 * Выполняет SQL запрос с параметрами
 */
export const query = async <T = any>(
  text: string,
  params?: any[]
): Promise<T[]> => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new AppError('Database operation failed', 500);
  }
};

/**
 * Выполняет SQL запрос и возвращает первую строку
 */
export const queryOne = async <T = any>(
  text: string,
  params?: any[]
): Promise<T | null> => {
  try {
    const result = await pool.query(text, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new AppError('Database operation failed', 500);
  }
};

/**
 * Выполняет транзакцию
 */
export const transaction = async <T>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};