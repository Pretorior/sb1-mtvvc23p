import React, { useState } from 'react';
import { MessageSquare, Search, AlertTriangle, Lock, Unlock, Flag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Discussion {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  lastActivity: Date;
  messageCount: number;
  locked: boolean;
  reported: boolean;
  reportCount?: number;
}

interface DiscussionModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  discussions: Discussion[];
  onLockDiscussion: (discussionId: string) => void;
  onUnlockDiscussion: (discussionId: string) => void;
  onDeleteDiscussion: (discussionId: string) => void;
}

export function DiscussionModerationModal({
  isOpen,
  onClose,
  discussions,
  onLockDiscussion,
  onUnlockDiscussion,
  onDeleteDiscussion
}: DiscussionModerationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Modération des discussions</h2>
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
                      onClick={() => onUnlockDiscussion(discussion.id)}
                      className="p-2 text-gray-400 hover:text-malibu-500 rounded-full hover:bg-malibu-50"
                      title="Déverrouiller"
                    >
                      <Lock className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onLockDiscussion(discussion.id)}
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
                  onClick={() => {
                    if (showDeleteConfirm) {
                      onDeleteDiscussion(showDeleteConfirm);
                      setShowDeleteConfirm(null);
                    }
                  }}
                  className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}