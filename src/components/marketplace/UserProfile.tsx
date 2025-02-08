import React from 'react';
import { Star, MapPin, MessageSquare, Shield, Package, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketplaceBook } from '../../types';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    location: string;
    memberSince: Date;
    verified: boolean;
    stats: {
      totalSales: number;
      positiveRatings: number;
      negativeRatings: number;
      responseRate: number;
      averageResponseTime: string;
    };
  };
  activeListings: MarketplaceBook[];
  soldItems: MarketplaceBook[];
}

export function UserProfile({ user, activeListings, soldItems }: UserProfileProps) {
  return (
    <div className="space-y-8">
      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  {user.name}
                  {user.verified && (
                    <Shield className="w-5 h-5 text-feijoa-500" />
                  )}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                  <span>•</span>
                  <span>
                    Membre depuis {new Date(user.memberSince).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link
                to={`/messages?user=${user.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Contacter
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(user.rating)
                          ? 'text-feijoa-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {user.rating} ({user.totalReviews} avis)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {user.stats.totalSales}
            </div>
            <p className="text-sm text-gray-500">Ventes réalisées</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-feijoa-500">
              {user.stats.positiveRatings}
            </div>
            <p className="text-sm text-gray-500">Avis positifs</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {user.stats.responseRate}%
            </div>
            <p className="text-sm text-gray-500">Taux de réponse</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {user.stats.averageResponseTime}
            </div>
            <p className="text-sm text-gray-500">Temps de réponse</p>
          </div>
        </div>
      </div>

      {/* Annonces actives */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Annonces en cours
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeListings.map((book) => (
            <Link
              key={book.id}
              to={`/marketplace/book/${book.id}`}
              className="group"
            >
              <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
                  {book.forSale?.price}€
                </div>
              </div>
              <h3 className="mt-2 font-medium text-gray-900 group-hover:text-malibu-500 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Historique des ventes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Livres vendus
        </h2>
        <div className="space-y-4">
          {soldItems.map((book) => (
            <div key={book.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-16 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{book.forSale?.price}€</span>
                  <span>•</span>
                  <span>Vendu le {book.forSale?.soldDate?.toLocaleDateString()}</span>
                </div>
              </div>
              {book.rating && (
                <div className="flex items-center gap-2">
                  {book.rating >= 4 ? (
                    <ThumbsUp className="w-5 h-5 text-feijoa-500" />
                  ) : (
                    <ThumbsDown className="w-5 h-5 text-apricot-500" />
                  )}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < book.rating
                            ? 'text-feijoa-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}