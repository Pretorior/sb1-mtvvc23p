import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ChatList } from '../components/ChatList';
import { Chat } from '../components/Chat';
import { useChat } from '../hooks/useChat';

export function Messages() {
  return (
    <Provider store={store}>
      <MessagesContent />
    </Provider>
  );
}

function MessagesContent() {
  const currentUser = {
    id: '1',
    name: 'Alexandre',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    readingStats: {
      booksRead: 12,
      pagesRead: 3240,
      currentStreak: 5,
      yearlyGoal: 24
    },
    badges: ['lecteur passionné', 'explorateur'],
    following: ['2', '3'],
    followers: ['2', '4', '5']
  };

  const {
    chats,
    messages,
    selectedChatId,
    sendMessage,
    selectChat,
    deleteChat,
    updateChatSettings,
    addParticipants,
    removeParticipant,
    leaveGroup
  } = useChat(currentUser.id);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <ChatList
            chats={chats}
            currentUser={currentUser}
            onSelectChat={selectChat}
            selectedChatId={selectedChatId}
            onDeleteChat={deleteChat}
          />
          {selectedChat ? (
            <Chat
              currentUser={currentUser}
              chat={selectedChat}
              messages={messages[selectedChatId] || []}
              onSendMessage={sendMessage}
              onUpdateSettings={updateChatSettings}
              onAddParticipants={addParticipants}
              onRemoveParticipant={removeParticipant}
              onLeaveGroup={leaveGroup}
              onDeleteChat={() => deleteChat(selectedChat.id)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-sm">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500">
                  Choisissez une conversation dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}