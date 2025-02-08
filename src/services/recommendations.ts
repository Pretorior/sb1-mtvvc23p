import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/ai`
});

export const recommendationService = {
  async getPersonalized(preferences: {
    genres: string[];
    mood?: string;
    recentBooks?: string[];
  }) {
    const { data } = await api.post('/recommendations', preferences);
    return data;
  },

  async analyzeText(text: string) {
    const { data } = await api.post('/analysis', { text });
    return data;
  }
};