import React, { useState } from 'react';
import { Book, Plus, ChevronRight, BookOpen, Edit2, Trash2, Move } from 'lucide-react';
import { Book as BookType } from '../../types';
import { useShelf } from '../../hooks/useShelf';

interface ShelfManagerProps {
  books: BookType[];
}

export function ShelfManager({ books }: ShelfManagerProps) {
  const {
    shelves,
    loading,
    error,
    createShelf,
    updateShelf,
    deleteShelf,
    addBookToShelf,
    removeBookFromShelf
  } = useShelf();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingShelf, setEditingShelf] = useState<string | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [draggedShelfId, setDraggedShelfId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const handleCreateShelf = async (name: string, icon: string, color: string) => {
    try {
      await createShelf({
        name,
        icon,
        color,
        bookIds: []
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'étagère:', error);
    }
  };

  const handleUpdateShelf = async (shelfId: string, updates: Partial<typeof shelves[0]>) => {
    try {
      await updateShelf(shelfId, updates);
      setEditingShelf(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étagère:', error);
    }
  };

  const handleDeleteShelf = async (shelfId: string) => {
    try {
      await deleteShelf(shelfId);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étagère:', error);
    }
  };

  const handleAddBookToShelf = async (shelfId: string, bookId: string) => {
    try {
      await addBookToShelf(shelfId, bookId);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre à l\'étagère:', error);
    }
  };

  const handleRemoveBookFromShelf = async (shelfId: string, bookId: string) => {
    try {
      await removeBookFromShelf(shelfId, bookId);
    } catch (error) {
      console.error('Erreur lors du retrait du livre de l\'étagère:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mes Étagères</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle étagère
        </button>
      </div>

      {/* Liste des étagères */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shelves.map((shelf) => (
          <div
            key={shelf.id}
            draggable
            onDragStart={() => setDraggedShelfId(shelf.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggedShelfId && draggedShelfId !== shelf.id) {
                // Gérer la fusion des étagères
                console.log('Fusion des étagères:', draggedShelfId, 'vers', shelf.id);
              }
              setDraggedShelfId(null);
            }}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${shelf.color}-100`}>
                  <BookOpen className={`w-5 h-5 text-${shelf.color}-500`} />
                </div>
                <h3 className="font-semibold text-gray-900">{shelf.name}</h3>
                <span className="text-sm text-gray-500">
                  {shelf.bookIds.length} livres
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingShelf(shelf.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteShelf(shelf.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Aperçu des livres */}
            <div className="grid grid-cols-3 gap-2">
              {books
                .filter((book) => shelf.bookIds.includes(book.id))
                .slice(0, 3)
                .map((book) => (
                  <img
                    key={book.id}
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                  />
                ))}
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  // Ouvrir le modal de gestion des livres
                  console.log('Gérer les livres de l\'étagère:', shelf.id);
                }}
                className="px-3 py-1.5 text-sm text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors inline-flex items-center gap-1"
              >
                <Move className="w-4 h-4" />
                Gérer les livres
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création d'étagère */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nouvelle étagère
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateShelf(
                  formData.get('name') as string,
                  formData.get('icon') as string,
                  formData.get('color') as string
                );
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'étagère
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône
                </label>
                <select
                  name="icon"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="BookOpen">Livre</option>
                  <option value="Bookmark">Marque-page</option>
                  <option value="Star">Étoile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <select
                  name="color"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="malibu">Bleu</option>
                  <option value="feijoa">Vert</option>
                  <option value="apricot">Orange</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition d'étagère */}
      {editingShelf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier l'étagère
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateShelf(editingShelf, {
                  name: formData.get('name') as string,
                  icon: formData.get('icon') as string,
                  color: formData.get('color') as string
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'étagère
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={shelves.find(s => s.id === editingShelf)?.name}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône
                </label>
                <select
                  name="icon"
                  defaultValue={shelves.find(s => s.id === editingShelf)?.icon}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="BookOpen">Livre</option>
                  <option value="Bookmark">Marque-page</option>
                  <option value="Star">Étoile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <select
                  name="color"
                  defaultValue={shelves.find(s => s.id === editingShelf)?.color}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="malibu">Bleu</option>
                  <option value="feijoa">Vert</option>
                  <option value="apricot">Orange</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingShelf(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}