import React, { useState } from 'react';
import { Trophy, BookOpen, Calendar, Target, X } from 'lucide-react';

interface ChallengeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (challenge: {
    title: string;
    description: string;
    type: 'books' | 'pages' | 'genre';
    target: number;
    genre?: string;
    startDate: Date;
    endDate: Date;
  }) => void;
}

export function ChallengeCreationModal({ isOpen, onClose, onCreateChallenge }: ChallengeCreationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'books' | 'pages' | 'genre'>('books');
  const [target, setTarget] = useState('');
  const [genre, setGenre] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && target && startDate && endDate) {
      onCreateChallenge({
        title,
        description,
        type,
        target: parseInt(target),
        genre: type === 'genre' ? genre : undefined,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Créer un défi de lecture</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du défi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Marathon Fantasy"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le défi et ses objectifs..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              required
            />
          </div>

          {/* Type de défi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de défi
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType('books')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  type === 'books'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <BookOpen className={`w-5 h-5 ${
                  type === 'books' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Nombre de livres</p>
                  <p className="text-xs text-gray-500">Lire X livres</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType('pages')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  type === 'pages'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Target className={`w-5 h-5 ${
                  type === 'pages' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Nombre de pages</p>
                  <p className="text-xs text-gray-500">Lire X pages</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType('genre')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  type === 'genre'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Trophy className={`w-5 h-5 ${
                  type === 'genre' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Genre spécifique</p>
                  <p className="text-xs text-gray-500">Lire X livres d'un genre</p>
                </div>
              </button>
            </div>
          </div>

          {/* Objectif */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                min="1"
                placeholder="Nombre..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                required
              />
            </div>

            {type === 'genre' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner un genre</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sf">Science-Fiction</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                  <option value="historical">Historique</option>
                  <option value="classic">Classique</option>
                </select>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Créer le défi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}