import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ReviewForm } from './ReviewForm';

interface UserRatingProps {
  rating: number;
  totalReviews: number;
  positiveRatings: number;
  negativeRatings: number;
  reviews: {
    id: string;
    type: 'seller' | 'buyer';
    rating: number;
    content: string;
    date: Date;
    recommend: boolean;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
  onSubmitReview: (review: {
    rating: number;
    content: string;
    type: 'seller' | 'buyer';
    recommend: boolean;
  }) => void;
}

export function UserRating({
  rating,
  totalReviews,
  positiveRatings,
  negativeRatings,
  reviews,
  onSubmitReview
}: UserRatingProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewType, setReviewType] = useState<'seller' | 'buyer'>('seller');

  return (
    <div className="space-y-6">
      {/* Note globale */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{rating.toFixed(1)}</div>
            <div className="flex items-center justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? 'text-feijoa-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {totalReviews} avis
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-feijoa-500">
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">{positiveRatings}</span>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-feijoa-400 rounded-full"
                  style={{ width: `${(positiveRatings / totalReviews) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-apricot-500">
                <ThumbsDown className="w-5 h-5" />
                <span className="font-medium">{negativeRatings}</span>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-apricot-400 rounded-full"
                  style={{ width: `${(negativeRatings / totalReviews) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              setReviewType('seller');
              setShowReviewForm(true);
            }}
            className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
          >
            Évaluer en tant que vendeur
          </button>
          <button
            onClick={() => {
              setReviewType('buyer');
              setShowReviewForm(true);
            }}
            className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
          >
            Évaluer en tant qu'acheteur
          </button>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-4">
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{review.author.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      review.recommend
                        ? 'bg-feijoa-100 text-feijoa-500'
                        : 'bg-apricot-100 text-apricot-500'
                    }`}>
                      {review.recommend ? 'Recommande' : 'Ne recommande pas'}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{review.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  En tant qu'{review.type === 'seller' ? 'acheteur' : 'vendeur'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal du formulaire d'avis */}
      {showReviewForm && (
        <ReviewForm
          onSubmit={(review) => {
            onSubmitReview({ ...review, type: reviewType });
            setShowReviewForm(false);
          }}
          onClose={() => setShowReviewForm(false)}
          type={reviewType}
        />
      )}
    </div>
  );
}