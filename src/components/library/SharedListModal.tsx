import React, { useState } from 'react';
import { Share2, Users, Globe, Lock, Link, X } from 'lucide-react';
import { Book } from '../../types';

interface SharedListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: {
    id: string;
    name: string;
    books: Book[];
    visibility: 'public' | 'private' | 'friends';
  };
  onShare: (visibility: 'public' | 'private' | 'friends', message?: string) => void;
}

export function SharedListModal({ isOpen, onClose, list, onShare }: SharedListModalProps) {
  const [visibility, setVisibility] = useState<'public' | 'private' | 'friends'>(list.visibility);
  const [message, setMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleShare = () => {
    onShare(visibility, message);
    // Simulate generating a share URL
    setShareUrl(`https://biblioshere.app/shared-list/${list.id}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Partager "{list.name}"
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visibility options */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setVisibility('public')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
              visibility === 'public'
                ? 'border-malibu-500 bg-malibu-50'
                : 'border-gray-200 hover:border-malibu-300'
            }`}
          >
            <Globe className={`w-5 h-5 ${
              visibility === 'public' ? 'text-malibu-500' : 'text-gray-400'
            }`} />
            <div className="text-left">
              <p className="font-medium text-gray-900">Public</p>
              <p className="text-sm text-gray-500">
                Tout le monde peut voir cette liste
              </p>
            </div>
          </button>

          <button
            onClick={() => setVisibility('friends')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
              visibility === 'friends'
                ? 'border-malibu-500 bg-malibu-50'
                : 'border-gray-200 hover:border-malibu-300'
            }`}
          >
            <Users className={`w-5 h-5 ${
              visibility === 'friends' ? 'text-malibu-500' : 'text-gray-400'
            }`} />
            <div className="text-left">
              <p className="font-medium text-gray-900">Amis uniquement</p>
              <p className="text-sm text-gray-500">
                Seuls vos amis peuvent voir cette liste
              </p>
            </div>
          </button>

          <button
            onClick={() => setVisibility('private')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
              visibility === 'private'
                ? 'border-malibu-500 bg-malibu-50'
                : 'border-gray-200 hover:border-malibu-300'
            }`}
          >
            <Lock className={`w-5 h-5 ${
              visibility === 'private' ? 'text-malibu-500' : 'text-gray-400'
            }`} />
            <div className="text-left">
              <p className="font-medium text-gray-900">Privé avec lien</p>
              <p className="text-sm text-gray-500">
                Seules les personnes avec le lien peuvent voir cette liste
              </p>
            </div>
          </button>
        </div>

        {/* Share message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (optionnel)
          </label>
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ajoutez un message pour vos lecteurs..."
              className="w-full pl-4 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-24"
            />
          </div>
        </div>

        {/* Share link */}
        {shareUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de partage
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-600"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  showCopySuccess
                    ? 'bg-feijoa-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showCopySuccess ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Annuler
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
          >
            Partager
          </button>
        </div>
      </div>
    </div>
  );
}