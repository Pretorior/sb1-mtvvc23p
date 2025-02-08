import React, { useState } from 'react';
import { X, Camera, Upload, Search, Loader2 } from 'lucide-react';
import { Book } from '../../types';
import { ISBNScanner } from './ISBNScanner';
import { BookForm } from './BookForm';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Omit<Book, 'id'>) => void;
}

type AddMethod = 'scan' | 'search' | 'manual' | 'batch';

export function AddBookModal({ isOpen, onClose, onAddBook }: AddBookModalProps) {
  const [method, setMethod] = useState<AddMethod>('scan');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleISBNScanned = async (isbn: string) => {
    setIsLoading(true);
    try {
      // Simuler une recherche dans l'API Google Books
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      if (data.items?.length > 0) {
        const bookInfo = data.items[0].volumeInfo;
        const book = {
          isbn,
          title: bookInfo.title,
          author: bookInfo.authors?.[0] || 'Auteur inconnu',
          coverUrl: bookInfo.imageLinks?.thumbnail || '',
          pageCount: bookInfo.pageCount || 0,
          genre: bookInfo.categories || [],
          status: 'to-read' as const,
          progress: {
            currentPage: 0
          }
        };
        onAddBook(book);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du livre:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Ajouter un livre</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Méthodes d'ajout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { id: 'scan', icon: Camera, label: 'Scanner' },
            { id: 'search', icon: Search, label: 'Rechercher' },
            { id: 'manual', icon: Upload, label: 'Manuel' },
            { id: 'batch', icon: Upload, label: 'Import en masse' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setMethod(id as AddMethod)}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                method === id
                  ? 'border-malibu-500 bg-malibu-50 text-malibu-500'
                  : 'border-gray-200 hover:border-malibu-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Contenu selon la méthode */}
        <div className="mt-6">
          {method === 'scan' && (
            <ISBNScanner onScan={handleISBNScanned} isLoading={isLoading} />
          )}

          {method === 'search' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, auteur ou ISBN..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-6 py-2 bg-malibu-500 text-white rounded-xl hover:bg-malibu-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Rechercher'
                  )}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-malibu-300 cursor-pointer transition-colors"
                      onClick={() => {
                        const bookInfo = result.volumeInfo;
                        onAddBook({
                          isbn: bookInfo.industryIdentifiers?.[0]?.identifier || '',
                          title: bookInfo.title,
                          author: bookInfo.authors?.[0] || 'Auteur inconnu',
                          coverUrl: bookInfo.imageLinks?.thumbnail || '',
                          pageCount: bookInfo.pageCount || 0,
                          genre: bookInfo.categories || [],
                          status: 'to-read',
                          progress: {
                            currentPage: 0
                          }
                        });
                      }}
                    >
                      <img
                        src={result.volumeInfo.imageLinks?.thumbnail || ''}
                        alt={result.volumeInfo.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {result.volumeInfo.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.volumeInfo.authors?.[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {method === 'manual' && (
            <BookForm onSubmit={onAddBook} />
          )}

          {method === 'batch' && (
            <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 rounded-xl">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Glissez-déposez un fichier CSV ou Excel
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ou
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors cursor-pointer inline-block"
              >
                Parcourir
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}