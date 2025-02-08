import React, { useState } from 'react';
import { ChatHeader } from './chat/ChatHeader';
import { ChatInput } from './chat/ChatInput';
import { ChatSettings } from './chat/ChatSettings';
import { GroupChatModal } from './chat/GroupChatModal';
import { Chat as ChatType, User, ChatMessage } from '../types';

interface ChatProps {
  currentUser: User;
  chat: ChatType;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onUpdateSettings: (settings: Partial<ChatType['settings']>) => void;
  onAddParticipants: (userIds: string[]) => void;
  onRemoveParticipant: (userId: string) => void;
  onLeaveGroup: () => void;
  onDeleteChat: () => void;
}

export function Chat({
  currentUser,
  chat,
  messages,
  onSendMessage,
  onUpdateSettings,
  onAddParticipants,
  onRemoveParticipant,
  onLeaveGroup,
  onDeleteChat
}: ChatProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddParticipants, setShowAddParticipants] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      <ChatHeader
        chat={chat}
        currentUser={currentUser}
        onAddParticipants={() => setShowAddParticipants(true)}
        onToggleNotifications={() => onUpdateSettings({ notifications: !chat.settings?.notifications })}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const sender = chat.participants.find(p => p.id === message.senderId);

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[70%]`}>
                {!isCurrentUser && (
                  <img
                    src={sender?.avatar}
                    alt={sender?.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isCurrentUser
                      ? 'bg-malibu-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        onTyping={() => {}}
      />

      {/* Modales */}
      <ChatSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        chat={chat}
        currentUser={currentUser}
        onUpdateSettings={onUpdateSettings}
        onAddParticipants={() => setShowAddParticipants(true)}
        onRemoveParticipant={onRemoveParticipant}
        onLeaveGroup={onLeaveGroup}
        onDeleteChat={onDeleteChat}
      />

      <GroupChatModal
        isOpen={showAddParticipants}
        onClose={() => setShowAddParticipants(false)}
        onCreateGroup={(name, participants) => {
          onAddParticipants(participants);
          setShowAddParticipants(false);
        }}
        availableUsers={[
          {
            id: '4',
            name: 'Sophie',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
          },
          {
            id: '5',
            name: 'Lucas',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
          }
        ]}
      />
    </div>
  );
}