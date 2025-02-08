import React from 'react';
import { BookOpen, Heart, BookmarkPlus, Check, ShoppingBag, Eye } from 'lucide-react';
import { Book } from '../../types';

interface QuickActionsProps {
  book: Book;
  onUpdateStatus: (bookId: string, status: Book['status']) => void;
  onAddToWishlist: (bookId: string) => void;
  onAddToFavorites: (bookId: string) => void;
}

export function QuickActions({ book, onUpdateStatus, onAddToWishlist, onAddToFavorites }: QuickActionsProps) {
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2">
      {/* Marquer comme lu */}
      <button
        onClick={() => onUpdateStatus(book.id, 'completed')}
        className={`p-2 rounded-full transition-colors ${
          book.status === 'completed'
            ? 'bg-feijoa-500 text-white'
            : 'bg-white/90 text-gray-600 hover:text-feijoa-500'
        }`}
        title="Marquer comme lu"
      >
        <Check className="w-5 h-5" />
      </button>

      {/* En cours de lecture */}
      <button
        onClick={() => onUpdateStatus(book.id, 'reading')}
        className={`p-2 rounded-full transition-colors ${
          book.status === 'reading'
            ? 'bg-malibu-500 text-white'
            : 'bg-white/90 text-gray-600 hover:text-malibu-500'
        }`}
        title="En cours de lecture"
      >
        <BookOpen className="w-5 h-5" />
      </button>

      {/* Ajouter à la wishlist */}
      <button
        onClick={() => onAddToWishlist(book.id)}
        className={`p-2 rounded-full transition-colors ${
          book.status === 'wishlist'
            ? 'bg-apricot-500 text-white'
            : 'bg-white/90 text-gray-600 hover:text-apricot-500'
        }`}
        title="Ajouter à la wishlist"
      >
        <BookmarkPlus className="w-5 h-5" />
      </button>

      {/* Ajouter aux favoris */}
      <button
        onClick={() => onAddToFavorites(book.id)}
        className={`p-2 rounded-full transition-colors ${
          book.status === 'favorites'
            ? 'bg-apricot-500 text-white'
            : 'bg-white/90 text-gray-600 hover:text-apricot-500'
        }`}
        title="Ajouter aux favoris"
      >
        <Heart className="w-5 h-5" />
      </button>
    </div>
  );
}