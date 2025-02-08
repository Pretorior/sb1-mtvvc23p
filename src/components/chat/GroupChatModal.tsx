import React, { useState } from 'react';
import { User, Users, X } from 'lucide-react';

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, participants: string[]) => void;
  availableUsers: User[];
}

export function GroupChatModal({ isOpen, onClose, onCreateGroup, availableUsers }: GroupChatModalProps) {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nouveau groupe</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Club de lecture"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants
            </label>
            <div className="space-y-2">
              {availableUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                    className="rounded border-gray-300 text-malibu-500 focus:ring-malibu-500"
                  />
                  <div className="flex items-center gap-3 ml-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (groupName && selectedUsers.length > 0) {
                  onCreateGroup(groupName, selectedUsers);
                  onClose();
                }
              }}
              disabled={!groupName || selectedUsers.length === 0}
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer le groupe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}