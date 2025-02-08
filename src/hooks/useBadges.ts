import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'reading' | 'social' | 'collection' | 'achievement';
  icon: string;
  requirements: Record<string, number>;
}

interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  progress: number;
  unlockedAt: Date | null;
  badge: Badge;
}

export function useBadges() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les badges
  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques des badges
  const getBadgeStats = () => {
    return {
      total: badges.length,
      unlocked: badges.filter(b => b.unlockedAt).length,
      byCategory: badges.reduce((acc, badge) => {
        const category = badge.badge.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentlyUnlocked: badges
        .filter(b => b.unlockedAt)
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
        .slice(0, 5)
    };
  };

  // Charger les badges au montage du composant
  useEffect(() => {
    fetchBadges();
  }, []);

  return {
    badges,
    loading,
    error,
    getBadgeStats,
    refreshBadges: fetchBadges
  };
}