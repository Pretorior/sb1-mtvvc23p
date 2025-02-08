import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, AlertTriangle, Lock, Unlock, Flag, X, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GroupDiscussionModerationProps {
  groupId: string;
}

export function GroupDiscussionModeration({ groupId }: GroupDiscussionModerationProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Exemple de données pour les discussions
  const discussions = [
    {
      id: '1',
      title: 'Discussion sur Les Misérables',
      author: {
        id: '2',
        name: 'Marie',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      lastActivity: new Date('2024-03-10'),
      messageCount: 25,
      locked: false,
      reported: true,
      reportCount: 2
    }
  ];

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLockDiscussion = (discussionId: string) => {
    console.log('Verrouillage de la discussion:', discussionId);
  };

  const handleUnlockDiscussion = (discussionId: string) => {
    console.log('Déverrouillage de la discussion:', discussionId);
  };

  const handleDeleteDiscussion = (discussionId: string) => {
    console.log('Suppression de la discussion:', discussionId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/community/group/${groupId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour au groupe
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Modération des discussions</h1>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une discussion..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-malibu-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className={`p-4 rounded-xl ${
                    discussion.reported ? 'bg-apricot-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <Link
                          to={`/community/discussion/${discussion.id}`}
                          className="font-medium text-gray-900 hover:text-malibu-500"
                        >
                          {discussion.title}
                        </Link>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <img
                              src={discussion.author.avatar}
                              alt={discussion.author.name}
                              className="w-4 h-4 rounded-full"
                            />
                            <span>{discussion.author.name}</span>
                          </div>
                          <span>•</span>
                          <span>{discussion.messageCount} messages</span>
                          <span>•</span>
                          <span>
                            Dernière activité : {new Date(discussion.lastActivity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {discussion.reported && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-apricot-100 text-apricot-500 rounded-full text-sm">
                          <Flag className="w-4 h-4" />
                          <span>{discussion.reportCount} signalement(s)</span>
                        </div>
                      )}

                      {discussion.locked ? (
                        <button
                          onClick={() => handleUnlockDiscussion(discussion.id)}
                          className="p-2 text-gray-400 hover:text-malibu-500 rounded-full hover:bg-malibu-50"
                          title="Déverrouiller"
                        >
                          <Lock className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLockDiscussion(discussion.id)}
                          className="p-2 text-gray-400 hover:text-malibu-500 rounded-full hover:bg-malibu-50"
                          title="Verrouiller"
                        >
                          <Unlock className="w-5 h-5" />
                        </button>
                      )}

                      <button
                        onClick={() => setShowDeleteConfirm(discussion.id)}
                        className="p-2 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50"
                        title="Supprimer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-4 text-apricot-500 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-semibold">Supprimer cette discussion ?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. Tous les messages de la discussion seront définitivement supprimés.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteDiscussion(showDeleteConfirm)}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}