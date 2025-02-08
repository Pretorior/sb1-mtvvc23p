import React, { useState } from 'react';
import { Search, Plus, Users, MoreVertical, Trash2 } from 'lucide-react';
import { Chat, User } from '../types';
import { Link } from 'react-router-dom';
import { FriendListModal } from './chat/FriendListModal';

interface ChatListProps {
  chats: Chat[];
  currentUser: User;
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  onDeleteChat?: (chatId: string) => void;
}

export function ChatList({ chats, currentUser, onSelectChat, selectedChatId, onDeleteChat }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFriendList, setShowFriendList] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredChats = chats.filter(chat =>
    chat.type === 'individual'
      ? chat.participants.some(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : chat.groupInfo?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteChat = (chatId: string) => {
    if (onDeleteChat) {
      onDeleteChat(chatId);
      setShowDeleteConfirm(null);
      setShowMenu(null);
    }
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-sm">
      {/* En-tête avec recherche */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFriendList(true)}
              className="p-2 text-gray-400 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              title="Nouvelle discussion"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFriendList(true)}
              className="p-2 text-gray-400 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              title="Créer un groupe"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-malibu-300"
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="divide-y divide-gray-100">
        {filteredChats.map((chat) => {
          const otherParticipant = chat.type === 'individual'
            ? chat.participants.find(p => p.id !== currentUser.id)
            : null;

          return (
            <div
              key={chat.id}
              className={`relative p-4 hover:bg-gray-50 transition-colors ${
                selectedChatId === chat.id ? 'bg-malibu-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0" onClick={() => onSelectChat(chat.id)}>
                  {chat.type === 'individual' ? (
                    <img
                      src={otherParticipant?.avatar}
                      alt={otherParticipant?.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-malibu-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-malibu-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0" onClick={() => onSelectChat(chat.id)}>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.type === 'individual' 
                      ? otherParticipant?.name 
                      : chat.groupInfo?.name}
                  </h3>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {chat.unreadCount > 0 && (
                    <span className="px-2 py-1 bg-malibu-500 text-white text-xs font-medium rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                  <button
                    onClick={() => setShowMenu(chat.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Menu contextuel */}
              {showMenu === chat.id && (
                <div className="absolute right-4 top-14 w-48 bg-white rounded-xl shadow-lg py-2 z-10">
                  <button
                    onClick={() => setShowDeleteConfirm(chat.id)}
                    className="w-full px-4 py-2 text-left text-apricot-500 hover:bg-apricot-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer la conversation
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FriendListModal
        isOpen={showFriendList}
        onClose={() => setShowFriendList(false)}
        currentUser={currentUser}
        onStartChat={(userId) => {
          // Logique pour démarrer une nouvelle conversation
          console.log('Démarrer une conversation avec:', userId);
          setShowFriendList(false);
        }}
        onCreateGroup={(name, participants) => {
          // Logique pour créer un nouveau groupe
          console.log('Créer un groupe:', { name, participants });
          setShowFriendList(false);
        }}
      />

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer la conversation ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. Tous les messages seront définitivement supprimés.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteChat(showDeleteConfirm)}
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