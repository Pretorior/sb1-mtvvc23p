import React, { useState } from 'react';
import { Trophy, BookOpen, Users, Calendar, Clock, Target } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'books' | 'pages' | 'genre';
  target: number;
  genre?: string;
  startDate: Date;
  endDate: Date;
  participants: {
    id: string;
    name: string;
    avatar: string;
    progress: number;
  }[];
}

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  onUpdateProgress: (challengeId: string, progress: number) => void;
}

export function ChallengeCard({ challenge, onJoin, onUpdateProgress }: ChallengeCardProps) {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const isUpcoming = new Date(challenge.startDate) > new Date();
  const isOngoing = new Date(challenge.startDate) <= new Date() && new Date(challenge.endDate) >= new Date();
  const isCompleted = new Date(challenge.endDate) < new Date();

  const getStatusColor = () => {
    if (isUpcoming) return 'bg-malibu-500 text-white';
    if (isOngoing) return 'bg-feijoa-500 text-white';
    if (isCompleted) return 'bg-gray-500 text-white';
    return 'bg-gray-100 text-gray-600';
  };

  const getStatusText = () => {
    if (isUpcoming) return 'À venir';
    if (isOngoing) return 'En cours';
    if (isCompleted) return 'Terminé';
    return 'Inconnu';
  };

  const formatTarget = () => {
    switch (challenge.type) {
      case 'books':
        return `${challenge.target} livres`;
      case 'pages':
        return `${challenge.target} pages`;
      case 'genre':
        return `${challenge.target} livres de ${challenge.genre}`;
      default:
        return challenge.target;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{challenge.participants.length} participants</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        <p className="mt-4 text-gray-600">{challenge.description}</p>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-malibu-500" />
              <span className="font-medium text-gray-900">Objectif : {formatTarget()}</span>
            </div>
            {isOngoing && (
              <button
                onClick={() => setShowProgressModal(true)}
                className="text-sm text-malibu-500 hover:text-malibu-600"
              >
                Mettre à jour
              </button>
            )}
          </div>
        </div>

        {/* Progression des participants */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Progression des participants</h4>
          <div className="space-y-4">
            {challenge.participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-3">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                    <span className="text-sm text-gray-500">{participant.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                      style={{ width: `${participant.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        {isUpcoming && (
          <button
            onClick={() => onJoin(challenge.id)}
            className="w-full px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
          >
            Participer au défi
          </button>
        )}
      </div>

      {/* Modal de mise à jour de la progression */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mettre à jour ma progression
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progression (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{progress}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onUpdateProgress(challenge.id, progress);
                    setShowProgressModal(false);
                  }}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}