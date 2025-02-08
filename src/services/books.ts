import axios from 'axios';
import { Book } from '../types';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/books`
});

export const bookService = {
  async search(query: string) {
    const { data } = await api.get('/search', { params: { q: query } });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/${id}`);
    return data;
  },

  async getRecommendations(userId: string) {
    const { data } = await api.get(`/recommendations/${userId}`);
    return data;
  },

  async updateReadingProgress(bookId: string, progress: {
    currentPage: number;
    totalPages: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { data } = await api.post(`/${bookId}/progress`, progress);
    return data;
  },

  async addReview(bookId: string, review: {
    rating: number;
    content: string;
    visibility: 'public' | 'friends' | 'private';
  }) {
    const { data } = await api.post(`/${bookId}/reviews`, review);
    return data;
  }
};