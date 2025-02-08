import React, { useState } from 'react';
import { Trophy, Calendar, BookOpen, Target, Users, ChevronRight, Plus } from 'lucide-react';
import { ChallengeCreationModal } from '../community/ChallengeCreationModal';
import { ChallengeCard } from '../community/ChallengeCard';

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

export function ReadingChallenges() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');

  // Exemple de défis personnels
  const personalChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Marathon Lecture 2024',
      description: 'Lire 24 livres en 2024',
      type: 'books',
      target: 24,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      participants: [
        {
          id: '1',
          name: 'Alexandre',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          progress: 25
        }
      ]
    },
    {
      id: '2',
      title: 'Challenge Pages',
      description: 'Lire 5000 pages en 3 mois',
      type: 'pages',
      target: 5000,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-31'),
      participants: [
        {
          id: '1',
          name: 'Alexandre',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          progress: 35
        }
      ]
    }
  ];

  // Exemple de défis de groupe
  const groupChallenges: Challenge[] = [
    {
      id: '3',
      title: 'Club des Classiques - Challenge Hugo',
      description: 'Lire 3 œuvres de Victor Hugo',
      type: 'books',
      target: 3,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      participants: [
        {
          id: '1',
          name: 'Alexandre',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          progress: 33
        },
        {
          id: '2',
          name: 'Marie',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
          progress: 66
        }
      ]
    }
  ];

  const handleCreateChallenge = (challenge: {
    title: string;
    description: string;
    type: 'books' | 'pages' | 'genre';
    target: number;
    genre?: string;
    startDate: Date;
    endDate: Date;
  }) => {
    console.log('Nouveau défi créé:', challenge);
    setShowCreateModal(false);
  };

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Rejoindre le défi:', challengeId);
  };

  const handleUpdateProgress = (challengeId: string, progress: number) => {
    console.log('Mise à jour de la progression:', { challengeId, progress });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'personal'
                ? 'bg-malibu-500 text-white'
                : 'text-gray-600 hover:text-malibu-500 hover:bg-malibu-50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Mes défis
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'group'
                ? 'bg-malibu-500 text-white'
                : 'text-gray-600 hover:text-malibu-500 hover:bg-malibu-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Défis de groupe
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau défi
        </button>
      </div>

      {/* Liste des défis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeTab === 'personal' ? personalChallenges : groupChallenges).map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onJoin={handleJoinChallenge}
            onUpdateProgress={handleUpdateProgress}
          />
        ))}
      </div>

      {/* Modal de création de défi */}
      <ChallengeCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChallenge={handleCreateChallenge}
      />
    </div>
  );
}