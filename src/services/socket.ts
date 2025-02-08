import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';
import { addMessage, updateMessage, addTypingUser, removeTypingUser } from '../store/chatSlice';
import { supabase } from '../lib/supabase';

class ChatService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private typingTimeouts: { [key: string]: NodeJS.Timeout } = {};

  async connect(userId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication token found');
      }

      this.socket = io(import.meta.env.VITE_API_URL, {
        auth: {
          token: session.access_token
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.setupEventListeners();
      
      // Log connection status
      console.info('WebSocket connection initialized');
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.info('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket?.disconnect();
      }
    });

    // Add event listeners for chat features
    this.socket.on('message', (message: any) => {
      store.dispatch(addMessage(message));
    });

    this.socket.on('messageUpdate', ({ messageId, updates }: any) => {
      store.dispatch(updateMessage({ messageId, updates }));
    });

    this.socket.on('typing', ({ chatId, userId }: any) => {
      store.dispatch(addTypingUser({ chatId, userId }));
    });

    this.socket.on('stopTyping', ({ chatId, userId }: any) => {
      store.dispatch(removeTypingUser({ chatId, userId }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.info('WebSocket disconnected');
    }

    // Clear all typing timeouts
    Object.values(this.typingTimeouts).forEach(clearTimeout);
    this.typingTimeouts = {};
  }
}

export const chatService = new ChatService();