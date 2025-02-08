import React, { useState } from 'react';
import { BookOpen, Filter, Search, Grid, List, BarChart2, Settings, Plus, BookMarked, Clock } from 'lucide-react';
import { BookGrid } from '../components/library/BookGrid';
import { BookList } from '../components/library/BookList';
import { BookStats } from '../components/library/BookStats';
import { ReadingGoals } from '../components/library/ReadingGoals';
import { AddBookModal } from '../components/library/AddBookModal';
import { ShelfManager } from '../components/library/ShelfManager';
import { BookActions } from '../components/library/BookActions';
import { SharedListModal } from '../components/library/SharedListModal';
import { ReadingTracker } from '../components/library/ReadingTracker';
import { ReadingProgress } from '../components/library/ReadingProgress';
import { ReadingNotifications } from '../components/library/ReadingNotifications';
import { useLibrary } from '../hooks/useLibrary';
import { Book } from '../types';

// Composant principal
export function Library() {
  const { 
    books, 
    loading, 
    error, 
    addBook, 
    updateBook, 
    deleteBook, 
    updateReadingProgress 
  } = useLibrary();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'books' | 'shelves' | 'tracker' | 'stats' | 'goals'>('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [showShareListModal, setShowShareListModal] = useState(false);
  const [selectedList, setSelectedList] = useState<{
    id: string;
    name: string;
    books: Book[];
    visibility: 'public' | 'private' | 'friends';
  } | null>(null);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 ||
                         book.genre.some(g => selectedGenres.includes(g));
    const matchesStatus = selectedStatus.length === 0 ||
                         selectedStatus.includes(book.status);
    return matchesSearch && matchesGenres && matchesStatus;
  });

  const handleOpenActions = (bookId: string) => {
    setSelectedBookId(bookId);
    setShowActionsModal(true);
  };

  const handleUpdateBookStatus = async (bookId: string, status: Book['status']) => {
    try {
      await updateBook(bookId, { status });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleAddToWishlist = (bookId: string) => {
    handleUpdateBookStatus(bookId, 'wishlist');
  };

  const handleAddToFavorites = async (bookId: string) => {
    try {
      await updateBook(bookId, { isFavorite: true });
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Ma Bibliothèque</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter un livre
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 py-4">
            {[
              { key: 'books', label: 'Livres', icon: BookOpen },
              { key: 'shelves', label: 'Étagères', icon: BookMarked },
              { key: 'tracker', label: 'Tracker', icon: Clock },
              { key: 'stats', label: 'Statistiques', icon: BarChart2 },
              { key: 'goals', label: 'Objectifs', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
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

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'books' && (
          <>
            {/* Search and filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un livre..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-malibu-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list'
                      ? 'bg-malibu-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <BookGrid 
                books={filteredBooks} 
                onOpenActions={handleOpenActions}
                onUpdateStatus={handleUpdateBookStatus}
                onAddToWishlist={handleAddToWishlist}
                onAddToFavorites={handleAddToFavorites}
              />
            ) : (
              <BookList 
                books={filteredBooks} 
                onOpenActions={handleOpenActions}
                onUpdateStatus={handleUpdateBookStatus}
                onAddToWishlist={handleAddToWishlist}
                onAddToFavorites={handleAddToFavorites}
              />
            )}
          </>
        )}

        {activeTab === 'shelves' && <ShelfManager books={books} />}
        {activeTab === 'tracker' && <ReadingTracker />}
        {activeTab === 'stats' && <BookStats books={books} />}
        {activeTab === 'goals' && <ReadingGoals />}
      </main>

      {/* Modals */}
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddBook={addBook}
      />

      {showActionsModal && selectedBookId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <BookActions
              book={books.find(b => b.id === selectedBookId)!}
              onUpdateBook={updateBook}
              onShareToFeed={(bookId, message) => {
                console.log('Share to feed:', { bookId, message });
                setShowActionsModal(false);
              }}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowActionsModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareListModal && selectedList && (
        <SharedListModal
          isOpen={showShareListModal}
          onClose={() => setShowShareListModal(false)}
          list={selectedList}
          onShare={(visibility, message) => {
            console.log('Share list:', { listId: selectedList.id, visibility, message });
            setShowShareListModal(false);
          }}
        />
      )}
    </div>
  );
}

// Export par défaut
export default Library;