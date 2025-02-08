import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ReadingSession, ReadingGoal } from '../types';

export function useReadingTracker() {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les sessions de lecture
  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select(`
          *,
          book:books(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Charger les objectifs de lecture
  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Ajouter une session de lecture
  const addSession = async (session: Omit<ReadingSession, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .insert([session])
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la session');
      throw err;
    }
  };

  // Mettre à jour une session de lecture
  const updateSession = async (id: string, updates: Partial<ReadingSession>) => {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => prev.map(session => 
        session.id === id ? { ...session, ...data } : session
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la session');
      throw err;
    }
  };

  // Supprimer une session de lecture
  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reading_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSessions(prev => prev.filter(session => session.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la session');
      throw err;
    }
  };

  // Créer ou mettre à jour un objectif de lecture
  const upsertGoal = async (goal: Omit<ReadingGoal, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('reading_goals')
        .upsert([goal])
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => {
        const index = prev.findIndex(g => g.type === goal.type && g.year === goal.year);
        if (index >= 0) {
          return prev.map((g, i) => i === index ? data : g);
        }
        return [...prev, data];
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'objectif');
      throw err;
    }
  };

  // Calculer les statistiques de lecture
  const getReadingStats = () => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();

    const yearSessions = sessions.filter(session => 
      new Date(session.date).getFullYear() === thisYear
    );

    const monthSessions = yearSessions.filter(session =>
      new Date(session.date).getMonth() === thisMonth
    );

    return {
      year: {
        totalSessions: yearSessions.length,
        totalPages: yearSessions.reduce((sum, session) => sum + session.pagesRead, 0),
        totalTime: yearSessions.reduce((sum, session) => sum + session.duration, 0),
        averagePagesPerSession: yearSessions.length 
          ? Math.round(yearSessions.reduce((sum, session) => sum + session.pagesRead, 0) / yearSessions.length)
          : 0
      },
      month: {
        totalSessions: monthSessions.length,
        totalPages: monthSessions.reduce((sum, session) => sum + session.pagesRead, 0),
        totalTime: monthSessions.reduce((sum, session) => sum + session.duration, 0),
        averagePagesPerSession: monthSessions.length
          ? Math.round(monthSessions.reduce((sum, session) => sum + session.pagesRead, 0) / monthSessions.length)
          : 0
      }
    };
  };

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSessions(), fetchGoals()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    sessions,
    goals,
    loading,
    error,
    addSession,
    updateSession,
    deleteSession,
    upsertGoal,
    getReadingStats,
    refreshData: async () => {
      await Promise.all([fetchSessions(), fetchGoals()]);
    }
  };
}