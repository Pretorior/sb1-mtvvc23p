import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Target, Plus, X } from 'lucide-react';
import { useReadingTracker } from '../../hooks/useReadingTracker';

export function ReadingTracker() {
  const {
    sessions,
    goals,
    loading,
    error,
    addSession,
    updateSession,
    deleteSession,
    upsertGoal,
    getReadingStats
  } = useReadingTracker();

  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const stats = getReadingStats();

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

  const handleAddSession = async (session: Omit<ReadingSession, 'id'>) => {
    try {
      await addSession(session);
      setShowAddSessionModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la session:', error);
    }
  };

  const handleUpdateSession = async (id: string, updates: Partial<ReadingSession>) => {
    try {
      await updateSession(id, updates);
      setSelectedSession(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
    }
  };

  const handleAddGoal = async (goal: Omit<ReadingGoal, 'id'>) => {
    try {
      await upsertGoal(goal);
      setShowAddGoalModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objectif:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-malibu-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-malibu-500" />
            </div>
            <span className="text-sm text-gray-500">Pages lues</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {stats.month.totalPages}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Ce mois-ci
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-feijoa-100 rounded-lg">
              <Clock className="w-5 h-5 text-feijoa-500" />
            </div>
            <span className="text-sm text-gray-500">Temps de lecture</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {Math.round(stats.month.totalTime / 60)}h{stats.month.totalTime % 60}m
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Ce mois-ci
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-apricot-100 rounded-lg">
              <Target className="w-5 h-5 text-apricot-500" />
            </div>
            <span className="text-sm text-gray-500">Moyenne</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {stats.month.averagePagesPerSession}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Pages par session
          </p>
        </div>
      </div>

      {/* Sessions de lecture */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sessions de lecture</h2>
          <button
            onClick={() => setShowAddSessionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle session
          </button>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-3 bg-malibu-100 rounded-xl">
                <Clock className="w-5 h-5 text-malibu-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.duration} minutes • {session.pagesRead} pages
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSession(session.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-1 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {session.notes && (
                  <p className="mt-2 text-sm text-gray-600">{session.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'ajout de session */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nouvelle session de lecture
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddSession({
                  bookId: formData.get('bookId') as string,
                  userId: supabase.auth.getUser()?.id as string,
                  date: new Date(),
                  duration: parseInt(formData.get('duration') as string),
                  pagesRead: parseInt(formData.get('pagesRead') as string),
                  notes: formData.get('notes') as string,
                  mood: formData.get('mood') as 'focused' | 'distracted' | 'tired' | 'energetic',
                  location: formData.get('location') as string
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pages lues
                </label>
                <input
                  type="number"
                  name="pagesRead"
                  min="1"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Humeur
                </label>
                <select
                  name="mood"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="focused">Concentré</option>
                  <option value="distracted">Distrait</option>
                  <option value="tired">Fatigué</option>
                  <option value="energetic">Énergique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  name="notes"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
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