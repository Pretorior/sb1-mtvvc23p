import React, { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, MessageSquare, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReadingEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
  };
  schedule: {
    startChapter: number;
    endChapter: number;
    deadline: Date;
  }[];
  participants: {
    id: string;
    name: string;
    avatar: string;
    progress: number;
  }[];
  discussions: {
    id: string;
    title: string;
    messageCount: number;
    lastActivity: Date;
  }[];
}

interface ReadingEventProps {
  event: ReadingEvent;
  onJoin: () => void;
  onUpdateProgress: (progress: number) => void;
}

export function ReadingEvent({ event, onJoin, onUpdateProgress }: ReadingEventProps) {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSchedule = event.schedule.find(s => 
    new Date(s.deadline) > new Date()
  );

  const isUpcoming = new Date(event.startDate) > new Date();
  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isCompleted = new Date(event.endDate) < new Date();

  const getStatusColor = () => {
    if (isUpcoming) return 'bg-malibu-500 text-white';
    if (isOngoing) return 'bg-feijoa-500 text-white';
    if (isCompleted) return 'bg-gray-500 text-white';
    return 'bg-gray-100 text-gray-600';
  };

  const getStatusText = () => {
    if (isUpcoming) return 'À venir';
    if (isOngoing) return 'En cours';
    if (isCompleted) return 'Terminé';
    return 'Inconnu';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* En-tête de l'événement */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.participants.length} participants</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        <p className="mt-4 text-gray-600">{event.description}</p>
      </div>

      {/* Livre en cours */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex gap-6">
          <Link to={`/library/book/${event.book.id}`}>
            <img
              src={event.book.coverUrl}
              alt={event.book.title}
              className="w-24 h-36 object-cover rounded-lg shadow-md"
            />
          </Link>
          <div>
            <Link
              to={`/library/book/${event.book.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-malibu-500"
            >
              {event.book.title}
            </Link>
            <p className="text-gray-600">{event.book.author}</p>

            {currentSchedule && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">Lecture en cours :</p>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    Chapitres {currentSchedule.startChapter} à {currentSchedule.endChapter}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Jusqu'au {new Date(currentSchedule.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progression des participants */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {event.participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3">
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{participant.name}</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-malibu-400 rounded-full"
                      style={{ width: `${participant.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{participant.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussions */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussions</h3>
        <div className="space-y-4">
          {event.discussions.map((discussion) => (
            <Link
              key={discussion.id}
              to={`/community/discussion/${discussion.id}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div>
                <h4 className="font-medium text-gray-900">{discussion.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{discussion.messageCount} messages</span>
                  </div>
                  <span>
                    Dernière activité : {new Date(discussion.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowProgressModal(true)}
            className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
          >
            Mettre à jour ma progression
          </button>
          {isUpcoming && (
            <button
              onClick={onJoin}
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Participer
            </button>
          )}
        </div>
      </div>

      {/* Modal de progression */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mettre à jour ma progression
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progression (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{progress}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onUpdateProgress(progress);
                    setShowProgressModal(false);
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