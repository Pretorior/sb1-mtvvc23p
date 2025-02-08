import React, { useState } from 'react';
import { Book, Series } from '../../types';
import { List, Check, Plus, ChevronRight } from 'lucide-react';

interface SeriesManagerProps {
  books: Book[];
  onCreateSeries: (series: Omit<Series, 'id'>) => void;
  onUpdateSeries: (series: Series) => void;
  onDeleteSeries: (seriesId: string) => void;
  onAddBookToSeries: (bookId: string, seriesId: string, volumeNumber: number) => void;
}

export function SeriesManager({
  books,
  onCreateSeries,
  onUpdateSeries,
  onDeleteSeries,
  onAddBookToSeries
}: SeriesManagerProps) {
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Exemple de séries
  const [series, setSeries] = useState<Series[]>([
    {
      id: '1',
      name: 'Harry Potter',
      volumes: [
        { bookId: '1', number: 1 },
        { bookId: '2', number: 2 },
        { bookId: '3', number: 3 }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Séries</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle série
        </button>
      </div>

      {/* Liste des séries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {series.map((series) => (
          <div
            key={series.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedSeries(selectedSeries?.id === series.id ? null : series)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{series.name}</h3>
                  <p className="text-sm text-gray-500">
                    {series.volumes.length} tomes
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedSeries?.id === series.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>

            {selectedSeries?.id === series.id && (
              <div className="border-t border-gray-100">
                <div className="p-4 space-y-4">
                  {/* Liste des tomes */}
                  <div className="space-y-2">
                    {series.volumes
                      .sort((a, b) => a.number - b.number)
                      .map((volume) => {
                        const book = books.find((b) => b.id === volume.bookId);
                        if (!book) return null;

                        return (
                          <div
                            key={volume.bookId}
                            className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                Tome {volume.number}
                              </h4>
                              <p className="text-sm text-gray-600">{book.title}</p>
                            </div>
                            {book.status === 'completed' && (
                              <Check className="w-5 h-5 text-feijoa-500" />
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors">
                      Tout marquer comme lu
                    </button>
                    <button className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors">
                      Ajouter un tome
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout de série */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nouvelle série
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onCreateSeries({
                  name: formData.get('name') as string,
                  volumes: []
                });
                setShowAddForm(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la série
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
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
    </div>
  );
}