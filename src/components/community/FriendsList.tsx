import React, { useState } from 'react';
import { Search, Bell, BellOff, UserMinus, MessageSquare, BookOpen, Star } from 'lucide-react';
import { User } from '../../types';
import { Link } from 'react-router-dom';

interface FriendsListProps {
  currentUser: User;
  onUnfollow: (userId: string) => void;
  onToggleNotifications: (userId: string) => void;
}

// Données de test pour les amis
const sampleFriends = [
  {
    id: '2',
    name: 'Marie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    readingStats: {
      booksRead: 15,
      pagesRead: 3800,
      currentStreak: 7,
      yearlyGoal: 30
    },
    currentlyReading: {
      title: 'Notre-Dame de Paris',
      author: 'Victor Hugo',
      progress: 45
    },
    lastReview: {
      bookTitle: 'Les Misérables',
      rating: 5,
      date: new Date('2024-03-10')
    },
    notificationsEnabled: true
  },
  {
    id: '3',
    name: 'Thomas',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    readingStats: {
      booksRead: 8,
      pagesRead: 2100,
      currentStreak: 3,
      yearlyGoal: 20
    },
    currentlyReading: {
      title: 'Madame Bovary',
      author: 'Gustave Flaubert',
      progress: 75
    },
    lastReview: {
      bookTitle: 'Le Comte de Monte-Cristo',
      rating: 4,
      date: new Date('2024-03-09')
    },
    notificationsEnabled: false
  },
  {
    id: '4',
    name: 'Sophie',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    readingStats: {
      booksRead: 20,
      pagesRead: 5200,
      currentStreak: 12,
      yearlyGoal: 40
    },
    currentlyReading: {
      title: 'Le Rouge et le Noir',
      author: 'Stendhal',
      progress: 30
    },
    lastReview: {
      bookTitle: 'Germinal',
      rating: 5,
      date: new Date('2024-03-08')
    },
    notificationsEnabled: true
  }
];

export function FriendsList({ currentUser, onUnfollow, onToggleNotifications }: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState<string | null>(null);

  const filteredFriends = sampleFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes amis</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ami..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredFriends.map((friend) => (
          <div key={friend.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <Link to={`/profile/${friend.id}`}>
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <Link 
                    to={`/profile/${friend.id}`}
                    className="font-semibold text-gray-900 hover:text-malibu-500 transition-colors"
                  >
                    {friend.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleNotifications(friend.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        friend.notificationsEnabled
                          ? 'bg-malibu-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={friend.notificationsEnabled ? 'Désactiver les notifications' : 'Activer les notifications'}
                    >
                      {friend.notificationsEnabled ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowUnfollowConfirm(friend.id)}
                      className="p-1.5 text-gray-500 hover:text-apricot-500 hover:bg-apricot-50 rounded-full transition-colors"
                      title="Ne plus suivre"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lecture en cours */}
                {friend.currentlyReading && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-malibu-400" />
                    <span className="text-gray-600">
                      Lit <span className="font-medium">{friend.currentlyReading.title}</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{friend.currentlyReading.progress}%</span>
                  </div>
                )}

                {/* Dernier avis */}
                {friend.lastReview && (
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-feijoa-400" />
                    <span className="text-gray-600">
                      A noté <span className="font-medium">{friend.lastReview.bookTitle}</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {friend.lastReview.rating}/5
                    </span>
                  </div>
                )}

                {/* Statistiques */}
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>{friend.readingStats.booksRead} livres lus</span>
                  <span>•</span>
                  <span>{friend.readingStats.currentStreak} jours de lecture</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="mt-3 flex gap-2">
              <Link
                to={`/messages?user=${friend.id}`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Link>
              <Link
                to={`/profile/${friend.id}`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                Voir le profil
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmation pour ne plus suivre */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ne plus suivre cet ami ?
            </h3>
            <p className="text-gray-600 mb-6">
              Vous ne verrez plus ses activités dans votre fil d'actualité.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUnfollowConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onUnfollow(showUnfollowConfirm);
                  setShowUnfollowConfirm(null);
                }}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Ne plus suivre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}