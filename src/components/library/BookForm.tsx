import React, { useState } from 'react';
import { Book } from '../../types';
import { Upload } from 'lucide-react';

interface BookFormProps {
  onSubmit: (book: Omit<Book, 'id'>) => void;
  initialData?: Partial<Book>;
}

export function BookForm({ onSubmit, initialData }: BookFormProps) {
  const [formData, setFormData] = useState({
    isbn: initialData?.isbn || '',
    title: initialData?.title || '',
    author: initialData?.author || '',
    coverUrl: initialData?.coverUrl || '',
    pageCount: initialData?.pageCount || 0,
    genre: initialData?.genre || [],
    status: initialData?.status || 'to-read',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      progress: {
        currentPage: 0
      }
    });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genres = e.target.value.split(',').map(g => g.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, genre: genres }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ISBN
          </label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            placeholder="978-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auteur
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de pages
          </label>
          <input
            type="number"
            value={formData.pageCount}
            onChange={(e) => setFormData(prev => ({ ...prev, pageCount: parseInt(e.target.value) }))}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genres (séparés par des virgules)
          </label>
          <input
            type="text"
            value={formData.genre.join(', ')}
            onChange={handleGenreChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            placeholder="Roman, Science-fiction, ..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
          >
            <option value="to-read">À lire</option>
            <option value="reading">En cours</option>
            <option value="completed">Terminé</option>
            <option value="borrowed">Emprunté</option>
            <option value="wishlist">Liste de souhaits</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
          placeholder="Vos notes personnelles..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Couverture
        </label>
        <div className="flex items-center gap-4">
          {formData.coverUrl && (
            <img
              src={formData.coverUrl}
              alt="Couverture"
              className="w-24 h-36 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <input
              type="text"
              value={formData.coverUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              placeholder="URL de l'image..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          Ajouter le livre
        </button>
      </div>
    </form>
  );
}