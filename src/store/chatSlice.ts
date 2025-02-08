import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatMessage, ChatGroup } from '../types';

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: ChatMessage[] };
  selectedChatId: string | null;
  loading: boolean;
  error: string | null;
  typing: { [chatId: string]: string[] };
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  selectedChatId: null,
  loading: false,
  error: null,
  typing: {}
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
    },
    updateChat: (state, action: PayloadAction<{ chatId: string; updates: Partial<Chat> }>) => {
      const index = state.chats.findIndex(chat => chat.id === action.payload.chatId);
      if (index !== -1) {
        state.chats[index] = { ...state.chats[index], ...action.payload.updates };
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
      delete state.messages[action.payload];
      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);

      // Mettre à jour le dernier message dans le chat
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload;
        // Incrémenter le compteur de messages non lus si ce n'est pas le chat sélectionné
        if (state.selectedChatId !== chatId) {
          state.chats[chatIndex].unreadCount = (state.chats[chatIndex].unreadCount || 0) + 1;
        }
      }
    },
    updateMessage: (state, action: PayloadAction<{ chatId: string; messageId: string; updates: Partial<ChatMessage> }>) => {
      const { chatId, messageId, updates } = action.payload;
      const messageIndex = state.messages[chatId]?.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        state.messages[chatId][messageIndex] = {
          ...state.messages[chatId][messageIndex],
          ...updates
        };
      }
    },
    deleteMessage: (state, action: PayloadAction<{ chatId: string; messageId: string }>) => {
      const { chatId, messageId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].filter(msg => msg.id !== messageId);
      }
    },
    setSelectedChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
      // Réinitialiser le compteur de messages non lus
      const chatIndex = state.chats.findIndex(chat => chat.id === action.payload);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    addTypingUser: (state, action: PayloadAction<{ chatId: string; userId: string }>) => {
      const { chatId, userId } = action.payload;
      if (!state.typing[chatId]) {
        state.typing[chatId] = [];
      }
      if (!state.typing[chatId].includes(userId)) {
        state.typing[chatId].push(userId);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ chatId: string; userId: string }>) => {
      const { chatId, userId } = action.payload;
      if (state.typing[chatId]) {
        state.typing[chatId] = state.typing[chatId].filter(id => id !== userId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setChats,
  addChat,
  updateChat,
  deleteChat,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setSelectedChat,
  addTypingUser,
  removeTypingUser,
  setLoading,
  setError
} = chatSlice.actions;

export default chatSlice.reducer;