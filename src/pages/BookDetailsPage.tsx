import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Book, BookOpen, Star, Clock, Calendar, BookMarked, Edit3, 
  Heart, ChevronLeft, Plus, Share2, MessageSquare, ShoppingBag,
  MapPin, DollarSign, Tag, Users, Percent, BookmarkPlus
} from 'lucide-react';
import { Book as BookType, Shelf } from '../types';
import { BookReview } from '../components/social/BookReview';
import { BookActions } from '../components/library/BookActions';

interface ReadingSession {
  id: string;
  date: Date;
  duration: number;
  pagesRead: number;
  notes?: string;
}

// Données de test pour les livres similaires
const similarBooks = [
  {
    id: '2',
    title: 'Notre-Dame de Paris',
    author: 'Victor Hugo',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
    matchScore: 95,
    readers: 1250,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=301',
    matchScore: 88,
    readers: 980,
    rating: 4.8
  },
  {
    id: '4',
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=302',
    matchScore: 82,
    readers: 750,
    rating: 4.5
  }
];

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddShelfModal, setShowAddShelfModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [note, setNote] = useState('');
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<string>('');
  const [personalNotes, setPersonalNotes] = useState<Array<{ id: string; content: string; date: Date }>>([]);
  const [showPersonalNoteModal, setShowPersonalNoteModal] = useState(false);
  const [newPersonalNote, setNewPersonalNote] = useState('');

  // Exemple de données de livre
  const book: BookType = {
    id: '1',
    isbn: '9780123456789',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
    pageCount: 1488,
    genre: ['Classique', 'Roman historique'],
    status: 'reading',
    progress: {
      currentPage: 450,
      startDate: new Date('2024-02-20')
    },
    publisher: 'Gallimard',
    publishDate: '1862',
    language: 'Français',
    description: 'Les Misérables est un roman de Victor Hugo publié en 1862, l\'un des plus vastes et des plus notables de la littérature française...',
    rating: 4.5,
    notes: 'Un chef-d\'œuvre de la littérature française',
    visibility: 'public'
  };

  // Statistiques sociales
  const socialStats = {
    currentReaders: 328,
    totalReviews: 1245,
    averageRating: 4.7,
    favorites: 892,
    discussions: 156,
    inReadingLists: 2341
  };

  // Exemple d'étagères
  const shelves: Shelf[] = [
    { id: '1', name: 'Classiques', icon: 'BookOpen', color: 'malibu', bookIds: [] },
    { id: '2', name: 'Favoris', icon: 'Heart', color: 'feijoa', bookIds: [] }
  ];

  const handleAddReadingSession = (session: Omit<ReadingSession, 'id'>) => {
    const newSession: ReadingSession = {
      ...session,
      id: Date.now().toString()
    };
    setReadingSessions([...readingSessions, newSession]);
    setShowAddSessionModal(false);
  };

  const handleAddPersonalNote = () => {
    if (newPersonalNote.trim()) {
      setPersonalNotes([
        ...personalNotes,
        {
          id: Date.now().toString(),
          content: newPersonalNote,
          date: new Date()
        }
      ]);
      setNewPersonalNote('');
      setShowPersonalNoteModal(false);
    }
  };

  const handleAddToShelf = () => {
    // Ajouter le livre à l'étagère sélectionnée
    setShowAddShelfModal(false);
    setSelectedShelf('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour à la bibliothèque
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Informations du livre */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex gap-6">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{book.title}</h1>
                      <p className="text-lg text-gray-600 mb-4">{book.author}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-apricot-500 hover:bg-apricot-50 rounded-full transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowAddShelfModal(true)}
                        className="p-2 text-gray-400 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                      >
                        <BookMarked className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Éditeur</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de publication</p>
                      <p className="font-medium">{book.publishDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Langue</p>
                      <p className="font-medium">{book.language}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {book.genre.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(book.rating || 0)
                              ? 'text-feijoa-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{book.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {book.pageCount} pages
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{book.description}</p>
              </div>
            </div>

            {/* Progression de lecture */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Progression de lecture</h2>
                <div className="px-3 py-1 bg-malibu-100 text-malibu-500 rounded-full text-sm font-medium">
                  {book.status === 'reading' ? 'En cours' :
                   book.status === 'completed' ? 'Terminé' :
                   book.status === 'to-read' ? 'À lire' :
                   'Liste de souhaits'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      {Math.round((book.progress.currentPage / book.pageCount) * 100)}% lu
                    </span>
                    <span>{book.progress.currentPage} / {book.pageCount} pages</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-malibu-400 rounded-full transition-all duration-300"
                      style={{ width: `${(book.progress.currentPage / book.pageCount) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Début de lecture</span>
                    </div>
                    <p className="font-medium">
                      {book.progress.startDate
                        ? new Date(book.progress.startDate).toLocaleDateString()
                        : 'Non commencé'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Fin de lecture</span>
                    </div>
                    <p className="font-medium">
                      {book.progress.endDate
                        ? new Date(book.progress.endDate).toLocaleDateString()
                        : 'En cours'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions de lecture */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sessions de lecture</h2>
                <button
                  onClick={() => setShowAddSessionModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle session
                </button>
              </div>

              <div className="space-y-4">
                {readingSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-malibu-100 rounded-xl">
                      <Clock className="w-5 h-5 text-malibu-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.duration} minutes • {session.pagesRead} pages
                          </p>
                        </div>
                        {session.notes && (
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {session.notes && (
                        <p className="mt-2 text-sm text-gray-600">{session.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques sociales */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Lecteurs actuels</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{socialStats.currentReaders}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Avis</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{socialStats.totalReviews}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Heart className="w-4 h-4" />
                    <span>Favoris</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{socialStats.favorites}</p>
                </div>
              </div>
            </div>

            {/* Livres similaires */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Livres similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarBooks.map((book) => (
                  <div key={book.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex gap-4">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="px-2 py-1 bg-malibu-100 text-malibu-500 rounded-full text-xs font-medium">
                            {book.matchScore}% match
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="w-4 h-4 text-feijoa-400 fill-current" />
                            <span className="ml-1">{book.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section des avis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Avis et commentaires</h2>
              <BookReview
                book={book}
                user={{
                  id: '1',
                  name: 'Alexandre',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
                }}
                onSubmitReview={(review) => {
                  console.log('Nouveau avis:', review);
                }}
                onLikeReview={(reviewId) => {
                  console.log('Like review:', reviewId);
                }}
                onReplyToReview={(reviewId, content) => {
                  console.log('Reply to review:', reviewId, content);
                }}
                onReportReview={(reviewId, reason) => {
                  console.log('Report review:', reviewId, reason);
                }}
              />
            </div>
          </div>

          {/* Colonne droite - Notes et étagères */}
          <div className="space-y-6">
            {/* Notes personnelles */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Notes personnelles</h2>
                <button
                  onClick={() => setShowPersonalNoteModal(true)}
                  className="flex items-center gap-2 text-malibu-500 hover:text-malibu-600"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une note
                </button>
              </div>

              <div className="space-y-4">
                {personalNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-500">
                        {new Date(note.date).toLocaleDateString()}
                      </p>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-gray-600">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Étagères */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Étagères</h2>
                <button
                  onClick={() => setShowAddShelfModal(true)}
                  className="flex items-center gap-2 text-malibu-500 hover:text-malibu-600"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter à une étagère
                </button>
              </div>

              <div className="space-y-2">
                {shelves.map((shelf) => (
                  <div
                    key={shelf.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${shelf.color}-100`}>
                        <BookOpen className={`w-4 h-4 text-${shelf.color}-500`} />
                      </div>
                      <span className="text-gray-900">{shelf.name}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <BookActions
                book={book}
                onUpdateBook={(bookId, updates) => {
                  console.log('Update book:', bookId, updates);
                }}
                onShareToFeed={(bookId, message) => {
                  console.log('Share to feed:', bookId, message);
                }}
              />
            </div>

            {/* Clubs de lecture */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Clubs de lecture</h2>
              {book.readingGroups && book.readingGroups.length > 0 ? (
                <div className="space-y-4">
                  {book.readingGroups.map((group) => (
                    <div key={group.groupId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <Link
                          to={`/community/group/${group.groupId}`}
                          className="font-medium text-gray-900 hover:text-malibu-500 transition-colors"
                        >
                          {group.groupName}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <MessageSquare className="w-4 h-4" />
                          <Link
                            to={group.discussionUrl}
                            className="hover:text-malibu-500 transition-colors"
                          >
                            Voir la discussion
                          </Link>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors">
                        Rejoindre
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Aucun club ne discute de ce livre pour le moment.
                  </p>
                  <Link
                    to="/community"
                    className="inline-block mt-4 px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                  >
                    Découvrir les clubs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de session de lecture */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nouvelle session de lecture
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddReadingSession({
                  date: new Date(),
                  duration: parseInt(formData.get('duration') as string),
                  pagesRead: parseInt(formData.get('pagesRead') as string),
                  notes: formData.get('notes') as string
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pages lues
                </label>
                <input
                  type="number"
                  name="pagesRead"
                  min="1"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  name="notes"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
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

      {/* Modal d'ajout de note personnelle */}
      {showPersonalNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nouvelle note personnelle
            </h3>
            <div className="space-y-4">
              <textarea
                value={newPersonalNote}
                onChange={(e) => setNewPersonalNote(e.target.value)}
                placeholder="Votre note..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPersonalNoteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddPersonalNote}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autres modales existantes */}
      {/* ... */}
    </div>
  );
}

export { BookDetailsPage }