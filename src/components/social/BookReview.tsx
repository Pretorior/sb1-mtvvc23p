import React, { useState } from 'react';
import { Star, Heart, MessageSquare, Flag, MoreHorizontal } from 'lucide-react';
import { Book, User } from '../../types';

interface BookReviewProps {
  book: Book;
  user: User;
  onSubmitReview: (review: { rating: number; content: string; visibility: 'public' | 'friends' | 'private' }) => void;
  onLikeReview: (reviewId: string) => void;
  onReplyToReview: (reviewId: string, content: string) => void;
  onReportReview: (reviewId: string, reason: string) => void;
}

// Données de test pour les avis
const sampleReviews = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Marie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    },
    rating: 5,
    content: "Une lecture absolument fascinante ! Victor Hugo nous plonge dans un Paris du XIXe siècle avec une maestria incomparable. Les personnages sont d'une profondeur rare, particulièrement Jean Valjean dont l'évolution morale est saisissante. Un chef-d'œuvre intemporel qui nous questionne sur la justice, la rédemption et l'amour.",
    date: new Date('2024-03-10').toISOString(),
    likes: 24,
    liked: false,
    replies: [
      {
        id: '1-1',
        user: {
          id: '3',
          name: 'Thomas',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
        },
        content: "Je suis totalement d'accord ! La description de la bataille de Waterloo m'a particulièrement marqué.",
        date: new Date('2024-03-10T14:30:00').toISOString()
      }
    ]
  },
  {
    id: '2',
    user: {
      id: '4',
      name: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    },
    rating: 4,
    content: "Un roman monumental qui demande du temps et de l'investissement, mais qui en vaut vraiment la peine. Les digressions historiques peuvent parfois ralentir le rythme, mais elles enrichissent considérablement la compréhension du contexte.",
    date: new Date('2024-03-09').toISOString(),
    likes: 15,
    liked: true,
    replies: []
  },
  {
    id: '3',
    user: {
      id: '5',
      name: 'Lucas',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
    },
    rating: 5,
    content: "Notre-Dame de Paris est une véritable déclaration d'amour à l'architecture gothique. La description de la cathédrale est si vivante qu'elle devient un personnage à part entière. L'histoire d'amour tragique entre Quasimodo et Esmeralda m'a profondément ému.",
    date: new Date('2024-03-08').toISOString(),
    likes: 18,
    liked: false,
    replies: [
      {
        id: '3-1',
        user: {
          id: '6',
          name: 'Emma',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
        },
        content: "La façon dont Hugo mêle l'histoire de Paris à celle de ses personnages est magistrale !",
        date: new Date('2024-03-08T16:45:00').toISOString()
      }
    ]
  },
  {
    id: '4',
    user: {
      id: '7',
      name: 'Julie',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=101'
    },
    rating: 4,
    content: "Madame Bovary est un chef-d'œuvre du réalisme. Flaubert dissèque avec une précision chirurgicale les rêves et les désillusions d'Emma. Le style est d'une beauté rare, chaque phrase est ciselée à la perfection.",
    date: new Date('2024-03-07').toISOString(),
    likes: 21,
    liked: false,
    replies: [
      {
        id: '4-1',
        user: {
          id: '8',
          name: 'Paul',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=101'
        },
        content: "Le procès pour immoralité qui a suivi la publication du roman est fascinant. Flaubert était vraiment en avance sur son temps.",
        date: new Date('2024-03-07T20:30:00').toISOString()
      }
    ]
  }
];

export function BookReview({ book, user, onSubmitReview, onLikeReview, onReplyToReview, onReportReview }: BookReviewProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating && content.trim()) {
      onSubmitReview({ rating, content, visibility });
      setRating(0);
      setContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire d'avis */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre avis</h3>
        
        <div className="space-y-4">
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
                    className={`w-6 h-6 ${
                      value <= rating
                        ? 'text-feijoa-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Avis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre commentaire
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              placeholder="Partagez votre expérience de lecture..."
              required
            />
          </div>

          {/* Visibilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qui peut voir cet avis ?
            </label>
            <div className="flex gap-2">
              {[
                { value: 'public', label: 'Tout le monde' },
                { value: 'friends', label: 'Mes amis' },
                { value: 'private', label: 'Privé' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVisibility(value as typeof visibility)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    visibility === value
                      ? 'bg-malibu-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!rating || !content.trim()}
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publier
            </button>
          </div>
        </div>
      </form>

      {/* Liste des avis */}
      <div className="space-y-4">
        {sampleReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={review.user.avatar}
                  alt={review.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-feijoa-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-gray-600">{review.content}</p>

            <div className="flex items-center gap-6 mt-4">
              <button
                onClick={() => onLikeReview(review.id)}
                className={`flex items-center gap-2 text-sm ${
                  review.liked
                    ? 'text-apricot-500'
                    : 'text-gray-500 hover:text-apricot-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${review.liked ? 'fill-current' : ''}`} />
                <span>{review.likes}</span>
              </button>
              <button
                onClick={() => setShowReplyForm(review.id)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-malibu-500"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{review.replies.length}</span>
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-apricot-500"
              >
                <Flag className="w-5 h-5" />
                <span>Signaler</span>
              </button>
            </div>

            {/* Réponses */}
            {review.replies.length > 0 && (
              <div className="mt-4 pl-14 space-y-4">
                {review.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={reply.user.avatar}
                        alt={reply.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{reply.user.name}</h5>
                        <p className="text-sm text-gray-500">
                          {new Date(reply.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire de réponse */}
            {showReplyForm === review.id && (
              <div className="mt-4 pl-14">
                <div className="bg-gray-50 rounded-xl p-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-24"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setShowReplyForm(null);
                        setReplyContent('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        if (replyContent.trim()) {
                          onReplyToReview(review.id, replyContent);
                          setShowReplyForm(null);
                          setReplyContent('');
                        }
                      }}
                      className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                    >
                      Répondre
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de signalement */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Signaler cet avis
            </h3>
            <div className="space-y-4">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Expliquez la raison du signalement..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (reportReason.trim()) {
                      onReportReview(review.id, reportReason);
                      setShowReportModal(false);
                      setReportReason('');
                    }
                  }}
                  className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
                >
                  Signaler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}