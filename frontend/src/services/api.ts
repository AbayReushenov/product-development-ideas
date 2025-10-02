import axios, { AxiosResponse } from 'axios';
import { Idea, VoteResponse, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class ApiService {
  /**
   * Получить список всех идей
   */
  static async getIdeas(): Promise<Idea[]> {
    try {
      const response: AxiosResponse<ApiResponse<Idea[]>> = await api.get('/ideas');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
      throw new Error('Не удалось загрузить список идей');
    }
  }

  /**
   * Проголосовать за идею
   */
  static async voteForIdea(ideaId: number): Promise<VoteResponse> {
    try {
      const response: AxiosResponse<ApiResponse<VoteResponse>> = await api.post(
        `/ideas/${ideaId}/vote`
      );
      return response.data.data!;
    } catch (error: any) {
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        throw new Error(errorData.message || 'Ошибка при голосовании');
      }
      console.error('Failed to vote for idea:', error);
      throw new Error('Не удалось проголосовать за идею');
    }
  }

  /**
   * Получить список идей, за которые проголосовал текущий IP
   */
  static async getMyVotes(): Promise<number[]> {
    try {
      const response: AxiosResponse<ApiResponse<number[]>> = await api.get('/ideas/votes/my');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch my votes:', error);
      throw new Error('Не удалось загрузить список проголосованных идей');
    }
  }
}
