import React from 'react';
import { User } from '../types';
import { BookOpen, TrendingUp, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeBannerProps {
  user: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Fond avec dégradé et motif */}
      <div className="absolute inset-0 bg-gradient-to-br from-malibu-400 to-malibu-500">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* Section gauche avec texte */}
          <div className="flex-1 min-w-0 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full ring-4 ring-white/30"
              />
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Bonjour, {user.name} 👋
                </h2>
                <p className="text-malibu-50">
                  Ravi de vous revoir ! Que souhaitez-vous lire aujourd'hui ?
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Livres lus</p>
                    <p className="text-white font-semibold text-lg">
                      {user.readingStats.booksRead}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Pages lues</p>
                    <p className="text-white font-semibold text-lg">
                      {user.readingStats.pagesRead}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Série actuelle</p>
                    <p className="text-white font-semibold text-lg">
                      {user.readingStats.currentStreak} jours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Objectif annuel</p>
                    <p className="text-white font-semibold text-lg">
                      {user.readingStats.booksRead}/{user.readingStats.yearlyGoal}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/library"
                className="px-6 py-3 bg-white text-malibu-500 rounded-full font-medium hover:bg-malibu-50 transition-colors"
              >
                Ma bibliothèque
              </Link>
              <Link
                to="/marketplace"
                className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
              >
                Explorer le marché
              </Link>
            </div>
          </div>

          {/* Section droite avec badges */}
          <div className="hidden lg:block lg:ml-8 animate-slide-up">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Vos badges</h3>
              <div className="grid grid-cols-2 gap-4">
                {user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}