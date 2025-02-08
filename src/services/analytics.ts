import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/analytics`
});

export const analyticsService = {
  async trackEvent(name: string, props?: Record<string, any>) {
    await api.post('/event', {
      name,
      url: window.location.href,
      props
    });
  },

  async getStats(period: 'day' | 'week' | 'month' | 'year') {
    const { data } = await api.get('/stats', { params: { period } });
    return data;
  }
};