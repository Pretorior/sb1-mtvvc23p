import React from 'react';
import { Book } from '../../types';
import { MoreHorizontal, Star, BookOpen, Calendar, Clock, Heart, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuickActions } from './QuickActions';

interface BookListProps {
  books: Book[];
  onOpenActions: (bookId: string) => void;
  onUpdateStatus: (bookId: string, status: Book['status']) => void;
  onAddToWishlist: (bookId: string) => void;
  onAddToFavorites: (bookId: string) => void;
}

export function BookList({ 
  books, 
  onOpenActions,
  onUpdateStatus,
  onAddToWishlist,
  onAddToFavorites 
}: BookListProps) {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div 
          key={book.id} 
          className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="p-4 flex gap-6">
            {/* Couverture du livre */}
            <Link 
              to={`/library/book/${book.id}`}
              className="relative flex-shrink-0 overflow-hidden"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-24 h-36 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
              />
              {book.status === 'reading' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div 
                    className="h-full bg-malibu-500"
                    style={{ width: `${Math.round((book.progress.currentPage / book.pageCount) * 100)}%` }}
                  />
                </div>
              )}
            </Link>

            {/* Informations du livre */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <Link 
                    to={`/library/book/${book.id}`}
                    className="font-semibold text-gray-900 hover:text-malibu-500 transition-colors line-clamp-1"
                  >
                    {book.title}
                  </Link>
                  <p className="text-gray-600">{book.author}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {book.pageCount} pages
                    </div>
                    {book.progress.startDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        Commencé le {new Date(book.progress.startDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {book.status === 'reading' && (
                    <span className="px-3 py-1 bg-malibu-100 text-malibu-500 rounded-full text-sm font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      En cours
                    </span>
                  )}
                  {book.forSale && (
                    <span className="px-3 py-1 bg-feijoa-100 text-feijoa-500 rounded-full text-sm font-medium flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      {book.forSale.price}€
                    </span>
                  )}
                  <button 
                    onClick={() => onOpenActions(book.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {book.rating && (
                <div className="mt-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(book.rating || 0)
                          ? 'text-feijoa-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">{book.rating}</span>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {book.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {book.status === 'reading' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>
                      {Math.round((book.progress.currentPage / book.pageCount) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                      style={{ width: `${(book.progress.currentPage / book.pageCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions rapides */}
              <div className="mt-4 flex items-center justify-between">
                <QuickActions
                  book={book}
                  onUpdateStatus={onUpdateStatus}
                  onAddToWishlist={onAddToWishlist}
                  onAddToFavorites={onAddToFavorites}
                />
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
                    <Share2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-apricot-50 rounded-full transition-colors group">
                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-apricot-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}