import React, { useState } from 'react';
import { Search, Users, Plus, X } from 'lucide-react';
import { User } from '../../types';

interface FriendListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onStartChat: (userId: string) => void;
  onCreateGroup: (name: string, participants: string[]) => void;
}

export function FriendListModal({
  isOpen,
  onClose,
  currentUser,
  onStartChat,
  onCreateGroup
}: FriendListModalProps) {
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  // Exemple de liste d'amis
  const friends = [
    {
      id: '2',
      name: 'Marie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      status: 'online'
    },
    {
      id: '3',
      name: 'Thomas',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
      status: 'offline'
    },
    {
      id: '4',
      name: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
      status: 'online'
    }
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'individual' ? 'Nouvelle discussion' : 'Nouveau groupe'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('individual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                mode === 'individual'
                  ? 'bg-malibu-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              Discussion individuelle
            </button>
            <button
              onClick={() => setMode('group')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                mode === 'group'
                  ? 'bg-malibu-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Groupe
            </button>
          </div>

          {mode === 'group' && (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nom du groupe"
              className="w-full px-4 py-2 mb-4 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            />
          )}

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un ami..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-malibu-300"
            />
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      friend.status === 'online' ? 'bg-feijoa-400' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{friend.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{friend.status}</p>
                  </div>
                </div>
                {mode === 'individual' ? (
                  <button
                    onClick={() => onStartChat(friend.id)}
                    className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                  >
                    Discuter
                  </button>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(friend.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, friend.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== friend.id));
                      }
                    }}
                    className="rounded border-gray-300 text-malibu-500 focus:ring-malibu-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {mode === 'group' && selectedUsers.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {selectedUsers.length} participant{selectedUsers.length > 1 ? 's' : ''} sélectionné{selectedUsers.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => {
                  if (groupName && selectedUsers.length > 0) {
                    onCreateGroup(groupName, selectedUsers);
                  }
                }}
                disabled={!groupName || selectedUsers.length === 0}
                className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer le groupe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}