import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    content: string;
    type: 'seller' | 'buyer';
    recommend: boolean;
  }) => void;
  onClose: () => void;
  type: 'seller' | 'buyer';
}

export function ReviewForm({ onSubmit, onClose, type }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [recommend, setRecommend] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating && content && recommend !== null) {
      onSubmit({
        rating,
        content,
        type,
        recommend
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  value <= rating
                    ? 'text-feijoa-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Recommandation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recommanderiez-vous ce {type === 'seller' ? 'vendeur' : 'acheteur'} ?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setRecommend(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              recommend === true
                ? 'bg-feijoa-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            Oui
          </button>
          <button
            type="button"
            onClick={() => setRecommend(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              recommend === false
                ? 'bg-apricot-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
            Non
          </button>
        </div>
      </div>

      {/* Commentaire */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre avis
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Décrivez votre expérience avec ce ${type === 'seller' ? 'vendeur' : 'acheteur'}...`}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!rating || !content || recommend === null}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publier l'avis
        </button>
      </div>
    </form>
  );
}