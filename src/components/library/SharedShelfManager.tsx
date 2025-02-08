import React, { useState } from 'react';
import { Globe, Users, Lock, Eye, EyeOff } from 'lucide-react';
import { Book, SharedShelf } from '../../types';

interface SharedShelfManagerProps {
  shelf: SharedShelf;
  books: Book[];
  onUpdateVisibility: (visibility: SharedShelf['visibility']) => void;
  onAddBooks: (bookIds: string[]) => void;
  onRemoveBook: (bookId: string) => void;
}

export function SharedShelfManager({
  shelf,
  books,
  onUpdateVisibility,
  onAddBooks,
  onRemoveBook
}: SharedShelfManagerProps) {
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState(shelf.visibility);

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles de visibilité */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">{shelf.name}</h2>
          <button
            onClick={() => setShowVisibilityModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            {shelf.visibility === 'public' ? (
              <>
                <Globe className="w-4 h-4" />
                Public
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Amis uniquement
              </>
            )}
          </button>
        </div>

        <div className="text-sm text-gray-500">
          {shelf.followers.length} abonnés
        </div>
      </div>

      {/* Liste des livres partagés */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative aspect-[2/3]">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemoveBook(book.id)}
                className="absolute top-2 right-2 p-1 bg-white/90 text-gray-600 hover:text-apricot-500 rounded-full transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de visibilité */}
      {showVisibilityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visibilité de l'étagère
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedVisibility('public')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  selectedVisibility === 'public'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Globe className={`w-5 h-5 ${
                  selectedVisibility === 'public' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Public</p>
                  <p className="text-sm text-gray-500">
                    Visible par tous les utilisateurs
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedVisibility('friends')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  selectedVisibility === 'friends'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Users className={`w-5 h-5 ${
                  selectedVisibility === 'friends' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Amis uniquement</p>
                  <p className="text-sm text-gray-500">
                    Visible uniquement par vos amis
                  </p>
                </div>
              </button>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowVisibilityModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onUpdateVisibility(selectedVisibility);
                    setShowVisibilityModal(false);
                  }}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}