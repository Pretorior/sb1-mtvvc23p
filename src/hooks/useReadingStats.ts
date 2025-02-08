import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ReadingSession, ReadingStreak } from '../types';

export function useReadingStats() {
  const [stats, setStats] = useState<{
    daily: { date: string; pages: number; time: number }[];
    weekly: { week: string; pages: number; time: number }[];
    monthly: { month: string; pages: number; time: number }[];
    streak: ReadingStreak;
  }>({
    daily: [],
    weekly: [],
    monthly: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastReadDate: new Date(),
      streakHistory: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      // Récupérer toutes les sessions de lecture
      const { data: sessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('*')
        .order('date', { ascending: true });

      if (sessionsError) throw sessionsError;

      // Calculer les statistiques quotidiennes
      const dailyStats = sessions?.reduce((acc: any[], session: ReadingSession) => {
        const date = new Date(session.date).toISOString().split('T')[0];
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.pages += session.pagesRead;
          existingDay.time += session.duration;
        } else {
          acc.push({
            date,
            pages: session.pagesRead,
            time: session.duration
          });
        }
        return acc;
      }, []) || [];

      // Calculer les statistiques hebdomadaires
      const weeklyStats = sessions?.reduce((acc: any[], session: ReadingSession) => {
        const date = new Date(session.date);
        const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
        const existingWeek = acc.find(w => w.week === week);
        
        if (existingWeek) {
          existingWeek.pages += session.pagesRead;
          existingWeek.time += session.duration;
        } else {
          acc.push({
            week,
            pages: session.pagesRead,
            time: session.duration
          });
        }
        return acc;
      }, []) || [];

      // Calculer les statistiques mensuelles
      const monthlyStats = sessions?.reduce((acc: any[], session: ReadingSession) => {
        const date = new Date(session.date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const existingMonth = acc.find(m => m.month === month);
        
        if (existingMonth) {
          existingMonth.pages += session.pagesRead;
          existingMonth.time += session.duration;
        } else {
          acc.push({
            month,
            pages: session.pagesRead,
            time: session.duration
          });
        }
        return acc;
      }, []) || [];

      // Calculer les séries de lecture
      const streakStats = calculateStreak(sessions || []);

      setStats({
        daily: dailyStats,
        weekly: weeklyStats,
        monthly: monthlyStats,
        streak: streakStats
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les séries de lecture
  const calculateStreak = (sessions: ReadingSession[]) => {
    if (!sessions.length) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: new Date(),
        streakHistory: []
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streakHistory = sessions.reduce((acc: { date: Date; pagesRead: number; duration: number }[], session) => {
      const date = new Date(session.date);
      date.setHours(0, 0, 0, 0);
      
      const existingDay = acc.find(day => 
        day.date.getTime() === date.getTime()
      );

      if (existingDay) {
        existingDay.pagesRead += session.pagesRead;
        existingDay.duration += session.duration;
      } else {
        acc.push({
          date,
          pagesRead: session.pagesRead,
          duration: session.duration
        });
      }
      return acc;
    }, []).sort((a, b) => b.date.getTime() - a.date.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = today;

    for (const day of streakHistory) {
      const diffDays = Math.floor((lastDate.getTime() - day.date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }
      
      lastDate = day.date;
    }

    // Vérifier si la série est toujours active
    const lastReadDate = streakHistory[0]?.date;
    const daysSinceLastRead = Math.floor((today.getTime() - lastReadDate.getTime()) / (1000 * 60 * 60 * 24));
    
    currentStreak = daysSinceLastRead <= 1 ? tempStreak : 0;

    return {
      currentStreak,
      longestStreak,
      lastReadDate,
      streakHistory
    };
  };

  // Charger les statistiques au montage du composant
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
}