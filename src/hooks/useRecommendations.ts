import { useState } from 'react';
import { recommendationService } from '../services/recommendations';
import { analyticsService } from '../services/analytics';

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (preferences: {
    genres: string[];
    mood?: string;
    recentBooks?: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const results = await recommendationService.getPersonalized(preferences);
      setRecommendations(results);
      analyticsService.trackEvent('get_recommendations', { preferences });
    } catch (err) {
      setError('Erreur lors de la génération des recommandations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    error,
    getRecommendations
  };
}