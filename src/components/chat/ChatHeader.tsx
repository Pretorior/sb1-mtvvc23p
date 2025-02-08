import React, { useState } from 'react';
import { MoreVertical, Phone, Camera as VideoCamera, Search, Bell, BellOff, UserPlus, Settings, Users } from 'lucide-react';
import { Chat, User } from '../../types';

interface ChatHeaderProps {
  chat: Chat;
  currentUser: User;
  onAddParticipants: () => void;
  onToggleNotifications: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({ chat, currentUser, onAddParticipants, onToggleNotifications, onOpenSettings }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const otherParticipant = chat.type === 'individual' 
    ? chat.participants.find(p => p.id !== currentUser.id)
    : null;

  return (
    <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {chat.type === 'individual' ? (
          <>
            <img
              src={otherParticipant?.avatar}
              alt={otherParticipant?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{otherParticipant?.name}</h2>
              <p className="text-sm text-gray-500">En ligne</p>
            </div>
          </>
        ) : (
          <>
            {chat.groupInfo?.avatar ? (
              <img
                src={chat.groupInfo.avatar}
                alt={chat.groupInfo.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-malibu-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-malibu-500" />
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">{chat.groupInfo?.name}</h2>
              <p className="text-sm text-gray-500">
                {chat.participants.length} participants
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
        {chat.type === 'individual' && (
          <>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <VideoCamera className="w-5 h-5" />
            </button>
          </>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10">
              {chat.type === 'group' && (
                <button
                  onClick={onAddParticipants}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter des participants
                </button>
              )}
              <button
                onClick={onToggleNotifications}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                {chat.settings?.notifications ? (
                  <>
                    <BellOff className="w-4 h-4" />
                    Désactiver les notifications
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Activer les notifications
                  </>
                )}
              </button>
              <button
                onClick={onOpenSettings}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Paramètres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}