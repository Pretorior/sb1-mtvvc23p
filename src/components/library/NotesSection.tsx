import React, { useState } from 'react';
import { Book, Calendar, Edit3, Trash2, Filter, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book as BookType, Note } from '../../types';

interface NotesSectionProps {
  notes: Note[];
  books: BookType[];
  onAddNote: (note: Note) => void;
  onEditNote: (id: string, note: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesSection({ notes, books, onAddNote, onEditNote, onDeleteNote }: NotesSectionProps) {
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Extraire tous les tags uniques
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  // Filtrer les notes
  const filteredNotes = notes.filter(note => {
    const matchesBook = !selectedBook || note.bookId === selectedBook;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags?.includes(tag));
    const matchesDate = (!dateRange.start || new Date(note.date) >= dateRange.start) &&
      (!dateRange.end || new Date(note.date) <= dateRange.end);
    return matchesBook && matchesTags && matchesDate;
  });

  const handleAddNote = (newNote: Omit<Note, 'id'>) => {
    onAddNote({
      ...newNote,
      id: Date.now().toString(),
    });
    setShowAddNoteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filtre par livre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Livre
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            >
              <option value="">Tous les livres</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>

          {/* Filtre par date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value ? new Date(e.target.value) : undefined })}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              />
              <input
                type="date"
                value={dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value ? new Date(e.target.value) : undefined })}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Filtre par tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-malibu-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex gap-4">
                <Link to={`/library/book/${note.bookId}`} className="flex-shrink-0">
                  <img
                    src={note.bookCover}
                    alt={note.bookTitle}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                </Link>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/library/book/${note.bookId}`}
                        className="font-medium text-gray-900 hover:text-malibu-500 transition-colors"
                      >
                        {note.bookTitle}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(note.date).toLocaleDateString()}</span>
                        {note.page && (
                          <>
                            <span>•</span>
                            <span>Page {note.page}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-gray-600">{note.content}</p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout/édition de note */}
      {(showAddNoteModal || editingNote) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingNote ? 'Modifier la note' : 'Nouvelle note'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const noteData = {
                  bookId: formData.get('bookId') as string,
                  bookTitle: books.find(b => b.id === formData.get('bookId'))?.title || '',
                  bookCover: books.find(b => b.id === formData.get('bookId'))?.coverUrl || '',
                  content: formData.get('content') as string,
                  date: new Date(),
                  page: parseInt(formData.get('page') as string) || undefined,
                  tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
                };

                if (editingNote) {
                  onEditNote(editingNote.id, noteData);
                  setEditingNote(null);
                } else {
                  handleAddNote(noteData);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Livre
                </label>
                <select
                  name="bookId"
                  defaultValue={editingNote?.bookId || ''}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="">Sélectionner un livre</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page (optionnel)
                </label>
                <input
                  type="number"
                  name="page"
                  defaultValue={editingNote?.page}
                  className="w-32 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  name="content"
                  defaultValue={editingNote?.content}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingNote?.tags?.join(', ')}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                  placeholder="analyse, citation, réflexion..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddNoteModal(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  {editingNote ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}