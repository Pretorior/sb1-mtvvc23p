import React, { useState } from 'react';
import { Calendar, Clock, Video, Users, MapPin, X } from 'lucide-react';

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: {
    title: string;
    description: string;
    type: 'online' | 'in-person';
    date: Date;
    time: string;
    location?: string;
    meetingUrl?: string;
    maxParticipants?: number;
  }) => void;
}

export function EventCreationModal({ isOpen, onClose, onCreateEvent }: EventCreationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'online' | 'in-person'>('online');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && date && time) {
      onCreateEvent({
        title,
        description,
        type,
        date: new Date(date),
        time,
        location: type === 'in-person' ? location : undefined,
        meetingUrl: type === 'online' ? meetingUrl : undefined,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Créer un événement</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'événement
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Discussion sur Les Misérables"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'événement..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              required
            />
          </div>

          {/* Type d'événement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'événement
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('online')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  type === 'online'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Video className={`w-5 h-5 ${
                  type === 'online' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">En ligne</p>
                  <p className="text-xs text-gray-500">Via Zoom, Google Meet, etc.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType('in-person')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  type === 'in-person'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <MapPin className={`w-5 h-5 ${
                  type === 'in-person' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">En présentiel</p>
                  <p className="text-xs text-gray-500">Rencontre physique</p>
                </div>
              </button>
            </div>
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Informations spécifiques au type */}
          {type === 'online' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien de la réunion
              </label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Adresse..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Nombre maximum de participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de participants (optionnel)
            </label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              min="1"
              placeholder="Illimité si vide"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Créer l'événement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}