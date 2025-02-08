import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setChats, setMessages, setSelectedChat, addMessage } from '../store/chatSlice';
import { chatService } from '../services/socket';
import { Message, ChatPreview, User } from '../types';

// Données de test
const mockUsers: User[] = [
  {
    id: '2',
    name: 'Marie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    readingStats: { booksRead: 15, pagesRead: 3800, currentStreak: 7, yearlyGoal: 30 },
    badges: ['bibliophile', 'critique littéraire'],
    following: ['1', '3'],
    followers: ['1', '4']
  },
  {
    id: '3',
    name: 'Thomas',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    readingStats: { booksRead: 8, pagesRead: 2100, currentStreak: 3, yearlyGoal: 20 },
    badges: ['lecteur passionné'],
    following: ['1'],
    followers: ['1', '2']
  },
  {
    id: '4',
    name: 'Sophie',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    readingStats: { booksRead: 20, pagesRead: 5200, currentStreak: 12, yearlyGoal: 40 },
    badges: ['expert', 'mentor'],
    following: ['1', '2'],
    followers: ['2']
  }
];

const mockChats: ChatPreview[] = [
  {
    id: 'chat1',
    participants: [mockUsers[0], { id: '1', name: 'Alexandre', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' } as User],
    lastMessage: {
      id: 'm1',
      chatId: 'chat1',
      content: 'Le prix est-il négociable ?',
      senderId: '2',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    },
    unreadCount: 2
  },
  {
    id: 'chat2',
    participants: [mockUsers[1], { id: '1', name: 'Alexandre', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' } as User],
    lastMessage: {
      id: 'm2',
      chatId: 'chat2',
      content: 'Super, on se dit 15h à la bibliothèque ?',
      senderId: '1',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString()
    },
    unreadCount: 0
  },
  {
    id: 'chat3',
    participants: [mockUsers[2], { id: '1', name: 'Alexandre', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' } as User],
    lastMessage: {
      id: 'm3',
      chatId: 'chat3',
      content: 'J\'ai adoré ce livre aussi ! On pourrait échanger nos impressions ?',
      senderId: '4',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    unreadCount: 1
  }
];

const mockMessages: { [key: string]: Message[] } = {
  chat1: [
    {
      id: 'm1-1',
      chatId: 'chat1',
      content: 'Bonjour ! J\'ai vu votre annonce pour "Le Comte de Monte-Cristo"',
      senderId: '2',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      id: 'm1-2',
      chatId: 'chat1',
      content: 'Il est toujours disponible ?',
      senderId: '2',
      timestamp: new Date(Date.now() - 14 * 60000).toISOString()
    },
    {
      id: 'm1-3',
      chatId: 'chat1',
      content: 'Oui, il est toujours disponible !',
      senderId: '1',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString()
    },
    {
      id: 'm1-4',
      chatId: 'chat1',
      content: 'Le prix est-il négociable ?',
      senderId: '2',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    }
  ],
  chat2: [
    {
      id: 'm2-1',
      chatId: 'chat2',
      content: 'Salut ! Pour l\'échange de livres dont on a parlé...',
      senderId: '3',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: 'm2-2',
      chatId: 'chat2',
      content: 'Je suis dispo cet après-midi si tu veux',
      senderId: '3',
      timestamp: new Date(Date.now() - 1.9 * 3600000).toISOString()
    },
    {
      id: 'm2-3',
      chatId: 'chat2',
      content: 'Parfait ! Quelle heure te conviendrait ?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1.8 * 3600000).toISOString()
    },
    {
      id: 'm2-4',
      chatId: 'chat2',
      content: '15h ça te va ?',
      senderId: '3',
      timestamp: new Date(Date.now() - 1.7 * 3600000).toISOString()
    },
    {
      id: 'm2-5',
      chatId: 'chat2',
      content: 'Super, on se dit 15h à la bibliothèque ?',
      senderId: '1',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString()
    }
  ],
  chat3: [
    {
      id: 'm3-1',
      chatId: 'chat3',
      content: 'Je viens de finir "Les Misérables", c\'était incroyable !',
      senderId: '4',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString()
    },
    {
      id: 'm3-2',
      chatId: 'chat3',
      content: 'C\'est l\'un de mes livres préférés !',
      senderId: '1',
      timestamp: new Date(Date.now() - 2.9 * 3600000).toISOString()
    },
    {
      id: 'm3-3',
      chatId: 'chat3',
      content: 'Le personnage de Jean Valjean est tellement bien écrit',
      senderId: '4',
      timestamp: new Date(Date.now() - 2.8 * 3600000).toISOString()
    },
    {
      id: 'm3-4',
      chatId: 'chat3',
      content: 'J\'ai adoré ce livre aussi ! On pourrait échanger nos impressions ?',
      senderId: '4',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
    }
  ]
};

export function useChat(userId: string) {
  const dispatch = useDispatch();
  const {
    chats,
    messages,
    selectedChatId,
    loading,
    error,
  } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    // Charger les données de test
    dispatch(setChats(mockChats));
    Object.entries(mockMessages).forEach(([chatId, msgs]) => {
      dispatch(setMessages({ chatId, messages: msgs }));
    });

    // Demander la permission pour les notifications
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // Connexion au serveur de chat
    chatService.connect(userId);

    return () => {
      chatService.disconnect();
    };
  }, [userId, dispatch]);

  const sendMessage = (content: string) => {
    if (selectedChatId) {
      const newMessage: Message = {
        id: 'm' + Date.now(),
        chatId: selectedChatId,
        content,
        senderId: userId,
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(newMessage));
    }
  };

  const selectChat = (chatId: string) => {
    dispatch(setSelectedChat(chatId));
  };

  return {
    chats,
    messages,
    selectedChatId,
    loading,
    error,
    sendMessage,
    selectChat,
  };
}