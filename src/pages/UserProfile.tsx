import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, Star, TrendingUp, Award, Filter, Calendar, MessageSquare, 
  Heart, Share2, Users, BookmarkPlus, Library, ChevronRight, Book,
  BarChart2, Clock, Eye, EyeOff
} from 'lucide-react';
import { Book as BookType, SharedShelf } from '../types';
import { BookGrid } from '../components/library/BookGrid';
import { BookStats } from '../components/library/BookStats';
import { UserRating } from '../components/marketplace/UserRating';
import { VerificationBadge } from '../components/verification/VerificationBadge';
import { IdentityVerification } from '../components/verification/IdentityVerification';

type TabType = 'overview' | 'shelves' | 'wishlist' | 'favorites' | 'stats' | 'activity' | 'badges' | 'ratings';

export function UserProfile() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'reviews' | 'discussions' | 'recommendations'>('all');
  const [showVerification, setShowVerification] = useState(false);

  const user = {
    id: userId,
    name: 'Alexandre',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    readingStats: {
      booksRead: 12,
      pagesRead: 3240,
      currentStreak: 5,
      yearlyGoal: 24,
      favoriteGenres: ['Roman', 'Science-Fiction', 'Fantasy'],
      totalBooks: 45,
      wishlistCount: 15,
      favoriteCount: 20
    },
    following: ['2', '3'],
    followers: ['2', '4', '5'],
    genreStats: {
      'Roman': 15,
      'Science-Fiction': 10,
      'Fantasy': 8,
      'Policier': 7,
      'Biographie': 5
    },
    wishlist: [
      {
        id: '1',
        title: 'Dune',
        author: 'Frank Herbert',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
        genre: ['Science-Fiction'],
        status: 'wishlist',
        addedDate: new Date('2024-02-15')
      }
    ],
    favorites: [
      {
        id: '2',
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
        genre: ['Classique'],
        status: 'completed',
        rating: 5,
        addedDate: new Date('2024-01-10')
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'review',
        date: new Date('2024-03-10'),
        book: {
          id: '1',
          title: 'Les Misérables',
          author: 'Victor Hugo',
          coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300'
        },
        content: 'Une lecture fascinante qui m\'a tenu en haleine jusqu\'à la dernière page.'
      }
    ],
    badges: [
      {
        id: '1',
        name: 'Lecteur Passionné',
        description: 'A lu plus de 10 livres',
        icon: 'BookOpen',
        progress: { current: 12, required: 10 }
      }
    ],
    verification: {
      status: 'unverified' as const,
      verifiedAt: undefined,
      verifiedBy: undefined,
      method: undefined,
      documentType: undefined,
      expiresAt: undefined
    }
  };

  const handleVerificationSubmit = async (files: File[]) => {
    try {
      console.log('Envoi des fichiers pour vérification:', files);
      
      setTimeout(() => {
        user.verification.status = 'pending';
        setShowVerification(false);
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Statistiques rapides */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-malibu-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-malibu-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Livres lus</p>
                <p className="text-xl font-semibold text-gray-900">
                  {user.readingStats.booksRead}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-feijoa-100 rounded-lg">
                <Heart className="w-5 h-5 text-feijoa-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Favoris</p>
                <p className="text-xl font-semibold text-gray-900">
                  {user.readingStats.favoriteCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-apricot-100 rounded-lg">
                <BookmarkPlus className="w-5 h-5 text-apricot-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Wishlist</p>
                <p className="text-xl font-semibold text-gray-900">
                  {user.readingStats.wishlistCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Library className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-semibold text-gray-900">
                  {user.readingStats.totalBooks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution par genre */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribution par genre
          </h3>
          <div className="space-y-4">
            {Object.entries(user.genreStats)
              .sort(([, a], [, b]) => b - a)
              .map(([genre, count]) => (
                <div key={genre}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{genre}</span>
                    <span className="text-gray-500">{count} livres</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-malibu-400 rounded-full"
                      style={{
                        width: `${(count / Math.max(...Object.values(user.genreStats))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité récente
          </h3>
          <div className="space-y-4">
            {user.recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={activity.book.coverUrl}
                  alt={activity.book.title}
                  className="w-16 h-24 object-cover rounded-lg"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{activity.date.toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/book/${activity.book.id}`}
                    className="font-medium text-gray-900 hover:text-malibu-500"
                  >
                    {activity.book.title}
                  </Link>
                  <p className="text-gray-600 mt-1">{activity.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques sociales */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Statistiques sociales
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-malibu-500" />
                <span className="text-gray-700">Abonnés</span>
              </div>
              <span className="font-semibold text-gray-900">
                {user.followers.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-malibu-500" />
                <span className="text-gray-700">Abonnements</span>
              </div>
              <span className="font-semibold text-gray-900">
                {user.following.length}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Badges récents
          </h3>
          <div className="space-y-4">
            {user.badges.map((badge) => (
              <div key={badge.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-malibu-100 rounded-lg">
                    <Award className="w-5 h-5 text-malibu-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                  </div>
                </div>
                {badge.progress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progression</span>
                      <span>{badge.progress.current}/{badge.progress.required}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-malibu-400 rounded-full"
                        style={{
                          width: `${(badge.progress.current / badge.progress.required) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Liste de souhaits</h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      <BookGrid
        books={user.wishlist}
        onOpenActions={() => {}}
        onUpdateStatus={() => {}}
        onAddToWishlist={() => {}}
        onAddToFavorites={() => {}}
      />
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Favoris</h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      <BookGrid
        books={user.favorites}
        onOpenActions={() => {}}
        onUpdateStatus={() => {}}
        onAddToWishlist={() => {}}
        onAddToFavorites={() => {}}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête du profil */}
      <div className="bg-gradient-to-br from-malibu-400 to-malibu-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full ring-4 ring-white"
            />
            <div className="text-white">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <VerificationBadge status={user.verification.status} />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{user.followers.length} abonnés</span>
                  <span>•</span>
                  <span>{user.following.length} abonnements</span>
                </div>
                {user.verification.status === 'unverified' && (
                  <button
                    onClick={() => setShowVerification(true)}
                    className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                  >
                    Vérifier mon profil
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/80">Livres lus</p>
                  <p className="text-xl font-semibold text-white">
                    {user.readingStats.booksRead}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/80">Favoris</p>
                  <p className="text-xl font-semibold text-white">
                    {user.readingStats.favoriteCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BookmarkPlus className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/80">Liste de souhaits</p>
                  <p className="text-xl font-semibold text-white">
                    {user.readingStats.wishlistCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Library className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/80">Total de livres</p>
                  <p className="text-xl font-semibold text-white">
                    {user.readingStats.totalBooks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 py-4">
            {[
              { key: 'overview', label: 'Aperçu', icon: BookOpen },
              { key: 'shelves', label: 'Étagères', icon: Library },
              { key: 'wishlist', label: 'Wishlist', icon: BookmarkPlus },
              { key: 'favorites', label: 'Favoris', icon: Heart },
              { key: 'stats', label: 'Statistiques', icon: BarChart2 },
              { key: 'activity', label: 'Activité', icon: Clock },
              { key: 'badges', label: 'Badges', icon: Award },
              { key: 'ratings', label: 'Évaluations', icon: Star }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
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
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'wishlist' && renderWishlist()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'stats' && (
          <BookStats books={[...user.wishlist, ...user.favorites]} />
        )}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tout' },
                { value: 'reviews', label: 'Avis' },
                { value: 'discussions', label: 'Discussions' },
                { value: 'recommendations', label: 'Recommandations' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActivityFilter(value as typeof activityFilter)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activityFilter === value
                      ? 'bg-malibu-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {user.recentActivity.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex gap-4">
                    <img
                      src={activity.book.coverUrl}
                      alt={activity.book.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{activity.date.toLocaleDateString()}</span>
                      </div>
                      <Link
                        to={`/book/${activity.book.id}`}
                        className="font-medium text-gray-900 hover:text-malibu-500"
                      >
                        {activity.book.title}
                      </Link>
                      <p className="text-gray-600 mt-1">{activity.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.badges.map((badge) => (
              <div key={badge.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-malibu-100 rounded-xl">
                    <Award className="w-6 h-6 text-malibu-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
                {badge.progress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progression</span>
                      <span>{badge.progress.current} / {badge.progress.required}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                        style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {activeTab === 'ratings' && (
          <UserRating
            rating={4.8}
            totalReviews={42}
            positiveRatings={38}
            negativeRatings={4}
            reviews={[
              {
                id: '1',
                type: 'seller',
                rating: 5,
                content: 'Excellent vendeur, livre en parfait état et envoi rapide !',
                date: new Date('2024-03-10'),
                recommend: true,
                author: {
                  id: '2',
                  name: 'Marie',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
                }
              }
            ]}
            onSubmitReview={(review) => {
              console.log('Nouvel avis:', review);
            }}
          />
        )}
      </main>

      {/* Modal de vérification */}
      <IdentityVerification
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onSubmit={handleVerificationSubmit}
      />
    </div>
  );
}