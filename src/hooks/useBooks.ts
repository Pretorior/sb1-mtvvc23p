import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { bookService } from '../services/books';
import { Book } from '../types';
import { analyticsService } from '../services/analytics';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await bookService.search(query);
      setBooks(results);
      analyticsService.trackEvent('book_search', { query });
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (bookId: string, progress: {
    currentPage: number;
    totalPages: number;
  }) => {
    try {
      await bookService.updateReadingProgress(bookId, progress);
      analyticsService.trackEvent('reading_progress_update', {
        bookId,
        progress: Math.round((progress.currentPage / progress.totalPages) * 100)
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    books,
    loading,
    error,
    searchBooks,
    updateProgress
  };
}