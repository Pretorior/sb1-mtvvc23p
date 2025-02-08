import React, { useState } from 'react';
import { ShoppingBag, Heart, MessageSquare, Share2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';

interface MarketplacePost {
  id: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  book: Book & {
    price: number;
    condition: 'new' | 'like-new' | 'very-good' | 'good' | 'acceptable';
    description: string;
    location: string;
  };
  timestamp: Date;
  likes: number;
  liked: boolean;
  comments: number;
}

interface MarketplacePostProps {
  post: MarketplacePost;
  onLike: (postId: string) => void;
  onAddToLibrary: (bookId: string) => void;
  onShare: (postId: string) => void;
}

export function MarketplacePost({ post, onLike, onAddToLibrary, onShare }: MarketplacePostProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        {/* En-tête du post */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={post.seller.avatar}
              alt={post.seller.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <Link
                to={`/profile/${post.seller.id}`}
                className="font-medium text-gray-900 hover:text-malibu-500"
              >
                {post.seller.name}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-feijoa-100 text-feijoa-500 rounded-full text-sm font-medium">
            {post.book.price}€
          </div>
        </div>

        {/* Détails du livre */}
        <div className="flex gap-4">
          <Link to={`/marketplace/book/${post.book.id}`}>
            <img
              src={post.book.coverUrl}
              alt={post.book.title}
              className="w-32 h-48 object-cover rounded-lg"
            />
          </Link>
          <div>
            <Link
              to={`/marketplace/book/${post.book.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-malibu-500"
            >
              {post.book.title}
            </Link>
            <p className="text-gray-600">{post.book.author}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {post.book.condition === 'new' ? 'Neuf' :
                 post.book.condition === 'like-new' ? 'Comme neuf' :
                 post.book.condition === 'very-good' ? 'Très bon état' :
                 post.book.condition === 'good' ? 'Bon état' : 'État correct'}
              </span>
              {post.book.genre.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="mt-3 text-gray-600">{post.book.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-4">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                post.liked
                  ? 'text-apricot-500 bg-apricot-50'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <Link
              to={`/messages?user=${post.seller.id}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contacter</span>
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAddToLibrary(post.book.id)}
              className="flex items-center gap-2 px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Ajouter à ma bibliothèque
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}