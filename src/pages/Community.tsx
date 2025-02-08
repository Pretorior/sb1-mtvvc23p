import React, { useState } from 'react';
import { Users, BookOpen, Award, Search, Filter, TrendingUp } from 'lucide-react';
import { SocialFeed } from '../components/community/SocialFeed';
import { GroupList } from '../components/community/GroupList';
import { RecommendationSection } from '../components/community/RecommendationSection';
import { FriendsList } from '../components/community/FriendsList';

export function Community() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'recommendations'>('feed');

  // Exemple d'utilisateur actuel
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

  const handleUnfollow = (userId: string) => {
    console.log('Unfollow user:', userId);
  };

  const handleToggleNotifications = (userId: string) => {
    console.log('Toggle notifications for user:', userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de la communauté */}
      <div className="bg-gradient-to-br from-malibu-400 to-malibu-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Communauté BiblioSphere</h1>
            <p className="text-malibu-50 text-lg max-w-2xl mx-auto">
              Partagez vos lectures, rejoignez des groupes et découvrez de nouveaux livres avec d'autres passionnés.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation secondaire */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <nav className="flex space-x-4">
              {[
                { key: 'feed', label: 'Fil d\'actualité', icon: TrendingUp },
                { key: 'groups', label: 'Groupes', icon: Users },
                { key: 'recommendations', label: 'Recommandations', icon: BookOpen },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === key
                      ? 'bg-malibu-500 text-white'
                      : 'text-gray-600 hover:text-malibu-500 hover:bg-malibu-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans la communauté..."
                  className="pl-10 pr-4 py-2 w-64 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none transition-colors"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Fil d'actualité */}
            <div className="lg:col-span-8">
              <SocialFeed />
            </div>
            
            {/* Liste d'amis */}
            <div className="lg:col-span-4">
              <FriendsList
                currentUser={currentUser}
                onUnfollow={handleUnfollow}
                onToggleNotifications={handleToggleNotifications}
              />
            </div>
          </div>
        ) : activeTab === 'groups' ? (
          <GroupList />
        ) : (
          <RecommendationSection />
        )}
      </main>
    </div>
  );
}