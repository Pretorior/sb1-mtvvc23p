import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { AlertCircle, Check, X } from 'lucide-react';

interface DuplicateDetectorProps {
  books: Book[];
  onMergeBooks: (sourceId: string, targetId: string) => void;
}

interface DuplicatePair {
  book1: Book;
  book2: Book;
  similarity: number;
}

export function DuplicateDetector({ books, onMergeBooks }: DuplicateDetectorProps) {
  const [duplicates, setDuplicates] = useState<DuplicatePair[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedPair, setSelectedPair] = useState<DuplicatePair | null>(null);

  // Fonction pour calculer la similarité entre deux chaînes
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;

    const distance = longerLength - [...new Set(longer)].filter(char => shorter.includes(char)).length;
    return (longerLength - distance) / longerLength;
  };

  // Détecter les doublons
  useEffect(() => {
    const potentialDuplicates: DuplicatePair[] = [];

    for (let i = 0; i < books.length; i++) {
      for (let j = i + 1; j < books.length; j++) {
        const book1 = books[i];
        const book2 = books[j];

        // Vérifier l'ISBN
        if (book1.isbn && book2.isbn && book1.isbn === book2.isbn) {
          potentialDuplicates.push({ book1, book2, similarity: 1 });
          continue;
        }

        // Vérifier la similarité du titre et de l'auteur
        const titleSimilarity = calculateSimilarity(book1.title, book2.title);
        const authorSimilarity = calculateSimilarity(book1.author, book2.author);
        const averageSimilarity = (titleSimilarity + authorSimilarity) / 2;

        if (averageSimilarity > 0.8) {
          potentialDuplicates.push({ book1, book2, similarity: averageSimilarity });
        }
      }
    }

    setDuplicates(potentialDuplicates);
  }, [books]);

  if (duplicates.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="bg-apricot-50 border-l-4 border-apricot-500 p-4 rounded-r-xl">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-apricot-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-apricot-800">
              Doublons potentiels détectés
            </h3>
            <p className="mt-1 text-sm text-apricot-700">
              {duplicates.length} paire(s) de livres semblent être des doublons.
              Vérifiez et fusionnez-les si nécessaire.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {duplicates.map((pair, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <img
                    src={pair.book1.coverUrl}
                    alt={pair.book1.title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{pair.book1.title}</h4>
                    <p className="text-sm text-gray-600">{pair.book1.author}</p>
                  </div>
                </div>

                <div className="px-4">
                  <div className="text-sm font-medium text-gray-500">
                    {Math.round(pair.similarity * 100)}% similaire
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-4">
                  <img
                    src={pair.book2.coverUrl}
                    alt={pair.book2.title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{pair.book2.title}</h4>
                    <p className="text-sm text-gray-600">{pair.book2.author}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPair(pair);
                    setShowMergeModal(true);
                  }}
                  className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                >
                  Fusionner
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de fusion */}
      {showMergeModal && selectedPair && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fusionner les livres
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {[selectedPair.book1, selectedPair.book2].map((book, index) => (
                <div key={book.id} className="space-y-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-lg mx-auto"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                    <p className="text-sm text-gray-500">{book.pageCount} pages</p>
                  </div>
                  <button
                    onClick={() => {
                      onMergeBooks(
                        index === 0 ? selectedPair.book2.id : selectedPair.book1.id,
                        book.id
                      );
                      setShowMergeModal(false);
                    }}
                    className="w-full px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                  >
                    Garder cette version
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMergeModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}