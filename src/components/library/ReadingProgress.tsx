import React, { useState, useEffect } from 'react';
import { Book, Calendar, Clock } from 'lucide-react';
import { Book as BookType } from '../../types';

interface ReadingProgressProps {
  book: BookType;
  onUpdateProgress: (progress: {
    currentPage: number;
    totalPages: number;
    startDate?: Date;
    endDate?: Date;
  }) => void;
}

export function ReadingProgress({ book, onUpdateProgress }: ReadingProgressProps) {
  const [currentPage, setCurrentPage] = useState(book.progress.currentPage);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReading) {
      timer = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReading]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const handleUpdateProgress = () => {
    onUpdateProgress({
      currentPage,
      totalPages: book.pageCount,
      startDate: book.progress.startDate,
      endDate: currentPage === book.pageCount ? new Date() : undefined
    });
    setShowUpdateModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Progression</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReading(!isReading)}
            className={`px-4 py-2 rounded-full transition-colors ${
              isReading
                ? 'bg-apricot-500 text-white'
                : 'bg-malibu-500 text-white'
            }`}
          >
            {isReading ? 'Pause' : 'Reprendre'}
          </button>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              {Math.round((currentPage / book.pageCount) * 100)}% lu
            </span>
            <span>{currentPage} / {book.pageCount} pages</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-malibu-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / book.pageCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>Temps de lecture</span>
            </div>
            <p className="font-medium text-gray-900">{formatTime(readingTime)}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Début</span>
            </div>
            <p className="font-medium text-gray-900">
              {book.progress.startDate
                ? new Date(book.progress.startDate).toLocaleDateString()
                : '-'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Book className="w-4 h-4" />
              <span>Pages/jour</span>
            </div>
            <p className="font-medium text-gray-900">
              {book.progress.startDate
                ? Math.round(
                    currentPage /
                    (
                      (new Date().getTime() - new Date(book.progress.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                    )
                  )
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de mise à jour */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mettre à jour la progression
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page actuelle
                </label>
                <input
                  type="number"
                  min="0"
                  max={book.pageCount}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateProgress}
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