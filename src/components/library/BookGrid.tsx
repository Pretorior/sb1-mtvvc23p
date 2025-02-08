import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onOpenActions: (bookId: string) => void;
  onUpdateStatus: (bookId: string, status: Book['status']) => void;
  onAddToWishlist: (bookId: string) => void;
  onAddToFavorites: (bookId: string) => void;
}

export function BookGrid({ 
  books, 
  onOpenActions,
  onUpdateStatus,
  onAddToWishlist,
  onAddToFavorites 
}: BookGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onStatusChange={(status) => onUpdateStatus(book.id, status)}
        />
      ))}
    </div>
  );
}