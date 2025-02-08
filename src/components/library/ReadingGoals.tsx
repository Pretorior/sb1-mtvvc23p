import React, { useState } from 'react';
import { Bell, Clock, Calendar, BookOpen, Target } from 'lucide-react';
import { useReadingGoals } from '../../hooks/useReadingGoals';

export function ReadingGoals() {
  const {
    goals,
    loading,
    error,
    upsertGoal,
    updateProgress,
    deleteGoal,
    getGoalsStats
  } = useReadingGoals();

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    progress: true,
    reminders: true,
    achievements: true,
    suggestions: true
  });

  const stats = getGoalsStats();
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">
          <div className="p-2 bg-gradient-to-br from-malibu-400 to-malibu-500 rounded-xl shadow-sm">
            <div className="w-12 h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const handleAddGoal = async (goal: {
    type: 'books' | 'pages' | 'time';
    target: number;
    year: number;
  }) => {
    try {
      await upsertGoal({
        ...goal,
        userId: (await supabase.auth.getUser()).data.user?.id as string,
        progress: 0
      });
      setShowAddGoalModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objectif:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Objectifs de lecture */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Objectifs de lecture</h2>
        
        <div className="space-y-6">
          {/* Objectif annuel de livres */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Objectif annuel de livres
              </label>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="text-sm text-malibu-500 hover:text-malibu-600"
              >
                Modifier
              </button>
            </div>
            {stats.books ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{stats.books.progress} / {stats.books.target} livres</span>
                  <span>{Math.round((stats.books.progress / stats.books.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.books.progress / stats.books.target) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-malibu-300 hover:text-malibu-500 transition-colors"
              >
                Définir un objectif
              </button>
            )}
          </div>

          {/* Objectif de pages */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Objectif de pages
              </label>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="text-sm text-malibu-500 hover:text-malibu-600"
              >
                Modifier
              </button>
            </div>
            {stats.pages ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{stats.pages.progress} / {stats.pages.target} pages</span>
                  <span>{Math.round((stats.pages.progress / stats.pages.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.pages.progress / stats.pages.target) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-malibu-300 hover:text-malibu-500 transition-colors"
              >
                Définir un objectif
              </button>
            )}
          </div>

          {/* Objectif de temps */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Objectif de temps de lecture
              </label>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="text-sm text-malibu-500 hover:text-malibu-600"
              >
                Modifier
              </button>
            </div>
            {stats.time ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{stats.time.progress} / {stats.time.target} heures</span>
                  <span>{Math.round((stats.time.progress / stats.time.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.time.progress / stats.time.target) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-malibu-300 hover:text-malibu-500 transition-colors"
              >
                Définir un objectif
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rappels et notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Rappels et notifications</h2>
        
        <div className="space-y-4">
          {[
            {
              id: 'progress',
              label: 'Suivi de progression',
              icon: BookOpen,
              description: 'Notifications sur votre avancement dans vos lectures'
            },
            {
              id: 'reminders',
              label: 'Rappels de lecture',
              icon: Clock,
              description: 'Rappels pour maintenir vos habitudes de lecture'
            },
            {
              id: 'achievements',
              label: 'Réalisations et badges',
              icon: Bell,
              description: 'Notifications quand vous atteignez vos objectifs'
            },
            {
              id: 'suggestions',
              label: 'Suggestions personnalisées',
              icon: Calendar,
              description: 'Recommandations basées sur vos lectures'
            }
          ].map(({ id, label, icon: Icon, description }) => (
            <div key={id} className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id={id}
                  type="checkbox"
                  checked={notifications[id as keyof typeof notifications]}
                  onChange={(e) => setNotifications({
                    ...notifications,
                    [id]: e.target.checked
                  })}
                  className="h-4 w-4 text-malibu-500 border-gray-300 rounded focus:ring-malibu-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-900">
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </label>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'ajout d'objectif */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nouvel objectif
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddGoal({
                  type: formData.get('type') as 'books' | 'pages' | 'time',
                  target: parseInt(formData.get('target') as string),
                  year: currentYear
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'objectif
                </label>
                <select
                  name="type"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                  required
                >
                  <option value="books">Nombre de livres</option>
                  <option value="pages">Nombre de pages</option>
                  <option value="time">Temps de lecture (heures)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objectif
                </label>
                <input
                  type="number"
                  name="target"
                  min="1"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}