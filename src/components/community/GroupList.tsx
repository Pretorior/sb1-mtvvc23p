import React, { useState } from 'react';
import { Users, BookOpen, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GroupCreationModal } from './GroupCreationModal';

interface ReadingGroup {
  id: string;
  name: string;
  description: string;
  banner: string;
  members: number;
  currentBook?: {
    title: string;
    author: string;
    cover: string;
  };
  nextMeeting?: string;
  tags: string[];
}

export function GroupList() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Exemple de données pour les groupes
  const sampleGroups: ReadingGroup[] = [
    {
      id: '1',
      name: 'Club des Classiques',
      description: 'Exploration des grands classiques de la littérature française et internationale.',
      banner: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000',
      members: 128,
      currentBook: {
        title: 'Madame Bovary',
        author: 'Gustave Flaubert',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
      },
      nextMeeting: '2024-03-15T18:00:00Z',
      tags: ['Classiques', 'Littérature', 'Discussion'],
    },
    {
      id: '2',
      name: 'Science-Fiction & Fantasy',
      description: 'Pour les amateurs d\'univers imaginaires et de voyages interstellaires.',
      banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
      members: 256,
      currentBook: {
        title: 'Dune',
        author: 'Frank Herbert',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
      },
      nextMeeting: '2024-03-18T19:00:00Z',
      tags: ['SF', 'Fantasy', 'Discussion'],
    },
  ];

  const handleCreateGroup = (group: {
    name: string;
    description: string;
    theme: string;
    coverUrl: string;
    visibility: 'public' | 'private' | 'invite-only';
    rules: string[];
  }) => {
    console.log('Nouveau groupe créé:', group);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Groupes de lecture</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Créer un groupe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleGroups.map((group) => (
          <Link
            key={group.id}
            to={`/community/group/${group.id}`}
            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 relative">
              <img
                src={group.banner}
                alt={group.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold text-white">{group.name}</h3>
                <div className="flex items-center text-white/80 text-sm mt-1">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{group.members} membres</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">{group.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {group.currentBook && (
                <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-4">
                  <BookOpen className="w-5 h-5 text-malibu-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Lecture en cours</p>
                    <p className="font-medium text-gray-900">{group.currentBook.title}</p>
                    <p className="text-sm text-gray-600">{group.currentBook.author}</p>
                  </div>
                </div>
              )}

              {group.nextMeeting && (
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-feijoa-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Prochaine rencontre</p>
                    <p className="font-medium text-gray-900">
                      {new Date(group.nextMeeting).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <GroupCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}