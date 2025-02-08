import React from 'react';
import { Book } from '../types';
import { BookOpen, Heart, Share2, ShoppingBag } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onStatusChange?: (status: Book['status']) => void;
}

export function BookCard({ book, onStatusChange }: BookCardProps) {
  const progressPercentage = Math.round((book.progress.currentPage / book.pageCount) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {book.forSale && (
          <div className="absolute top-3 right-3 bg-feijoa-400 text-white px-3 py-1 rounded-full text-sm font-medium">
            À vendre
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 text-gray-900">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{book.author}</p>
        
        {book.status === 'reading' && (
          <div className="mb-6">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{progressPercentage}% lu</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-malibu-50 rounded-full transition-colors group">
              <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-malibu-400" />
            </button>
            <button className="p-2 hover:bg-apricot-50 rounded-full transition-colors group">
              <Heart className="w-5 h-5 text-gray-400 group-hover:text-apricot-400" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
              <Share2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
            {book.forSale && (
              <button className="p-2 hover:bg-feijoa-50 rounded-full transition-colors group">
                <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-feijoa-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}