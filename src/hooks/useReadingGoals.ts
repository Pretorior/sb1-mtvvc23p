import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ReadingGoal } from '../types';

export function useReadingGoals() {
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les objectifs
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
    } finally {
      setLoading(false);
    }
  };

  // Créer ou mettre à jour un objectif
  const upsertGoal = async (goal: Omit<ReadingGoal, 'id' | 'created_at' | 'updated_at'>) => {
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

  // Mettre à jour la progression d'un objectif
  const updateProgress = async (id: string, progress: number) => {
    try {
      const { data, error } = await supabase
        .from('reading_goals')
        .update({ progress })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(goal => goal.id === id ? { ...goal, progress } : goal));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la progression');
      throw err;
    }
  };

  // Supprimer un objectif
  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reading_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'objectif');
      throw err;
    }
  };

  // Calculer les statistiques des objectifs
  const getGoalsStats = () => {
    const currentYear = new Date().getFullYear();
    const yearlyGoals = goals.filter(goal => goal.year === currentYear);

    return {
      books: yearlyGoals.find(goal => goal.type === 'books'),
      pages: yearlyGoals.find(goal => goal.type === 'pages'),
      time: yearlyGoals.find(goal => goal.type === 'time'),
      totalGoals: yearlyGoals.length,
      completedGoals: yearlyGoals.filter(goal => goal.progress >= goal.target).length
    };
  };

  // Charger les objectifs au montage du composant
  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    upsertGoal,
    updateProgress,
    deleteGoal,
    getGoalsStats,
    refreshGoals: fetchGoals
  };
}