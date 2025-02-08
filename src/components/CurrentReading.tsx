import React, { useState, useEffect, useRef } from 'react';
import { Book, Play, Pause, Clock, BookOpen, Save, Plus, X, RotateCcw, BookmarkPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReadingNote {
  id: string;
  page?: number;
  content: string;
  type: 'personal' | 'quote' | 'excerpt';
  visibility: 'private' | 'public';
  timestamp: Date;
}

interface ReadingSession {
  startTime: Date;
  endTime?: Date;
  duration: number;
  pagesRead?: number;
  notes: ReadingNote[];
}

interface CurrentReadingProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    pageCount: number;
    progress: {
      currentPage: number;
      startDate?: Date;
    };
  };
  onSaveSession: (session: ReadingSession) => void;
}

export function CurrentReading({ book, onSaveSession }: CurrentReadingProps) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pagesRead, setPagesRead] = useState<number | undefined>();
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [newNote, setNewNote] = useState({
    page: '',
    content: '',
    type: 'personal' as const,
    visibility: 'private' as const
  });
  const [status, setStatus] = useState<'reading' | 'completed'>('reading');
  const timerRef = useRef<NodeJS.Timeout>();
  const sessionStartRef = useRef<Date>();

  useEffect(() => {
    if (isReading && !isPaused) {
      if (!sessionStartRef.current) {
        sessionStartRef.current = new Date();
      }
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isReading, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setIsReading(true);
    setIsPaused(false);
    setShowSessionModal(true);
  };

  const handlePauseSession = () => {
    setIsPaused(true);
  };

  const handleResumeSession = () => {
    setIsPaused(false);
  };

  const handleResetTimer = () => {
    setTimer(0);
  };

  const handleStopSession = () => {
    setIsReading(false);
    setIsPaused(false);
    setShowConfirmModal(true);
  };

  const handleAddNote = () => {
    if (newNote.content.trim()) {
      const note: ReadingNote = {
        id: Date.now().toString(),
        page: newNote.page ? parseInt(newNote.page) : undefined,
        content: newNote.content,
        type: newNote.type,
        visibility: newNote.visibility,
        timestamp: new Date()
      };
      setNotes([...notes, note]);
      setNewNote({
        page: '',
        content: '',
        type: 'personal',
        visibility: 'private'
      });
      setShowNoteModal(false);
    }
  };

  const handleSaveSession = () => {
    if (sessionStartRef.current) {
      const session: ReadingSession = {
        startTime: sessionStartRef.current,
        endTime: new Date(),
        duration: timer,
        pagesRead,
        notes
      };
      onSaveSession(session);
      setTimer(0);
      setPagesRead(undefined);
      setNotes([]);
      sessionStartRef.current = undefined;
      setShowConfirmModal(false);
      setShowSessionModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-6">
        <Link to={`/library/book/${book.id}`} className="flex-shrink-0">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-24 h-36 object-cover rounded-lg shadow-md"
          />
        </Link>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link 
                to={`/library/book/${book.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-malibu-500 transition-colors"
              >
                {book.title}
              </Link>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <button
              onClick={isReading ? handleStopSession : handleStartSession}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isReading
                  ? 'bg-apricot-500 text-white hover:bg-apricot-600'
                  : 'bg-malibu-500 text-white hover:bg-malibu-600'
              }`}
            >
              {isReading ? (
                <>
                  <X className="w-5 h-5" />
                  Arrêter la lecture
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Commencer la lecture
                </>
              )}
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
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
        </div>
      </div>

      {/* Modal de session de lecture */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Session de lecture</h3>
              <button
                onClick={() => {
                  if (isReading) {
                    handleStopSession();
                  }
                  setShowSessionModal(false);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Timer */}
              <div className="flex flex-col items-center gap-4">
                <div className="px-6 py-3 bg-gray-100 rounded-full text-2xl font-mono">
                  {formatTime(timer)}
                </div>
                <div className="flex gap-2">
                  {isPaused ? (
                    <button
                      onClick={handleResumeSession}
                      className="p-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseSession}
                      className="p-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleResetTimer}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">Notes</h4>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="flex items-center gap-1 text-sm text-malibu-500 hover:text-malibu-600"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une note
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                      {note.page && (
                        <div className="text-sm text-gray-500 mb-1">
                          Page {note.page}
                        </div>
                      )}
                      <p className="text-gray-600">{note.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                          {note.type === 'personal' ? 'Note personnelle' :
                           note.type === 'quote' ? 'Citation' : 'Extrait'}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                          {note.visibility === 'private' ? 'Privé' : 'Public'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleStopSession}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Terminer la session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de note */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter une note
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page (optionnel)
                </label>
                <input
                  type="number"
                  value={newNote.page}
                  onChange={(e) => setNewNote({ ...newNote, page: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de note
                </label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({ ...newNote, type: e.target.value as 'personal' | 'quote' | 'excerpt' })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="personal">Note personnelle</option>
                  <option value="quote">Citation</option>
                  <option value="excerpt">Extrait</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibilité
                </label>
                <select
                  value={newNote.visibility}
                  onChange={(e) => setNewNote({ ...newNote, visibility: e.target.value as 'private' | 'public' })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="private">Privé</option>
                  <option value="public">Public</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                  placeholder="Votre note..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation et sauvegarde */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Terminer la session
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages lues
                </label>
                <input
                  type="number"
                  value={pagesRead || ''}
                  onChange={(e) => setPagesRead(parseInt(e.target.value) || undefined)}
                  min="1"
                  max={book.pageCount - book.progress.currentPage}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'reading' | 'completed')}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="reading">En cours</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveSession}
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