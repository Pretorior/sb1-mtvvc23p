import React from 'react';
import { BookOpen, Clock, Star, Users, Trophy, Lock } from 'lucide-react';
import { useBadges } from '../../hooks/useBadges';

export function BadgesList() {
  const { badges, loading, error, getBadgeStats } = useBadges();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">
          <div className="p-2 bg-gradient-to-br from-malibu-400 to-malibu-500 rounded-xl shadow-sm">
            <div className="w-12 h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const stats = getBadgeStats();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen;
      case 'Clock':
        return Clock;
      case 'Star':
        return Star;
      case 'Users':
        return Users;
      case 'Trophy':
        return Trophy;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reading':
        return 'bg-malibu-100 text-malibu-500';
      case 'social':
        return 'bg-feijoa-100 text-feijoa-500';
      case 'collection':
        return 'bg-apricot-100 text-apricot-500';
      case 'achievement':
        return 'bg-purple-100 text-purple-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Statistiques des badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-malibu-100 rounded-lg">
              <Trophy className="w-5 h-5 text-malibu-500" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {stats.total}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-feijoa-100 rounded-lg">
              <Star className="w-5 h-5 text-feijoa-500" />
            </div>
            <span className="text-sm text-gray-500">Débloqués</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {stats.unlocked}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-apricot-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-apricot-500" />
            </div>
            <span className="text-sm text-gray-500">Lecture</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {stats.byCategory.reading || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm text-gray-500">Social</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-4">
            {stats.byCategory.social || 0}
          </p>
        </div>
      </div>

      {/* Liste des badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((userBadge) => {
          const badge = userBadge.badge;
          const Icon = getIconComponent(badge.icon);
          const isUnlocked = !!userBadge.unlockedAt;

          return (
            <div
              key={userBadge.id}
              className={`bg-white rounded-xl shadow-sm p-6 ${
                isUnlocked ? '' : 'opacity-75'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${getCategoryColor(badge.category)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    {!isUnlocked && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{userBadge.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked ? 'bg-feijoa-400' : 'bg-malibu-400'
                    }`}
                    style={{ width: `${userBadge.progress}%` }}
                  />
                </div>
              </div>

              {/* Date de débloquage */}
              {isUnlocked && (
                <p className="text-sm text-gray-500 mt-2">
                  Débloqué le {new Date(userBadge.unlockedAt!).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}