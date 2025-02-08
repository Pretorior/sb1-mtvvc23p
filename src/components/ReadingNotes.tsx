import React from 'react';
import { Book, Calendar, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Note {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  content: string;
  date: Date;
  page?: number;
}

interface ReadingNotesProps {
  notes: Note[];
}

export function ReadingNotes({ notes }: ReadingNotesProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notes de lecture</h2>
        <Link
          to="/library?tab=notes"
          className="text-sm text-malibu-500 hover:text-malibu-600"
        >
          Voir toutes les notes
        </Link>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            <Link to={`/library/book/${note.bookId}`} className="flex-shrink-0">
              <img
                src={note.bookCover}
                alt={note.bookTitle}
                className="w-16 h-24 object-cover rounded-lg"
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
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="mt-2 text-gray-600 line-clamp-3">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}