import React from 'react';
import { Book } from '../../types';
import { BookOpen, Heart, Share2, ShoppingBag, Star, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onStatusChange?: (status: Book['status']) => void;
}

export function BookCard({ book, onStatusChange }: BookCardProps) {
  const progressPercentage = Math.round((book.progress.currentPage / book.pageCount) * 100);

  return (
    <div className="group relative">
      {/* Carte principale */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        {/* Image de couverture avec overlay */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={book.coverUrl} 
            alt={book.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay avec actions rapides */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-4 left-4 right-4">
              <Link
                to={`/library/book/${book.id}`}
                className="block w-full px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-center font-medium hover:bg-white transition-colors"
              >
                Voir les détails
              </Link>
            </div>
          </div>

          {/* Badge de statut */}
          {book.status === 'reading' && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-malibu-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
              <Clock className="w-4 h-4" />
              En cours
            </div>
          )}

          {book.forSale && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-feijoa-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              {book.forSale.price}€
            </div>
          )}

          {/* Barre de progression pour les livres en cours */}
          {book.status === 'reading' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div 
                className="h-full bg-malibu-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Informations du livre */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-malibu-500 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{book.author}</p>

          {/* Note et genres */}
          <div className="space-y-2">
            {book.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(book.rating)
                        ? 'text-feijoa-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">{book.rating}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {book.genre.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {genre}
                </span>
              ))}
              {book.genre.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{book.genre.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-malibu-50 rounded-full transition-colors group">
                <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-malibu-500" />
              </button>
              <button className="p-2 hover:bg-apricot-50 rounded-full transition-colors group">
                <Heart className="w-5 h-5 text-gray-400 group-hover:text-apricot-500" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
              {book.forSale && (
                <button className="p-2 hover:bg-feijoa-50 rounded-full transition-colors group">
                  <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-feijoa-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}