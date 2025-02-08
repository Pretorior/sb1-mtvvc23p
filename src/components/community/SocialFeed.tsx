import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, BookOpen, Star, Image, Bookmark, AlertCircle, ThumbsUp, ThumbsDown, BookmarkPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  book?: {
    id: string;
    title: string;
    author: string;
    cover: string;
    rating: number;
  };
  reactions: {
    type: 'thumbsUp' | 'thumbsDown' | 'heart';
    count: number;
    reacted: boolean;
  }[];
  spoilerAlert?: boolean;
}

export function SocialFeed() {
  const [newMessage, setNewMessage] = useState('');
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [postVisibility, setPostVisibility] = useState<'public' | 'friends' | 'private'>('public');

  // Données de test pour les posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        id: '2',
        name: 'Marie',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      content: 'Je viens de terminer "Les Misérables" de Victor Hugo. Une œuvre magistrale qui nous questionne sur l\'absurdité de la condition humaine. La transformation de Jean Valjean est simplement extraordinaire. Qu\'en pensez-vous ?',
      timestamp: new Date('2024-03-10T14:30:00Z').toISOString(),
      book: {
        id: '1',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
        rating: 5
      },
      reactions: [
        { type: 'thumbsUp', count: 15, reacted: false },
        { type: 'thumbsDown', count: 2, reacted: false },
        { type: 'heart', count: 8, reacted: false }
      ]
    },
    {
      id: '2',
      author: {
        id: '3',
        name: 'Thomas',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
      },
      content: 'Notre-Dame de Paris est une véritable déclaration d\'amour à l\'architecture gothique. La description de la cathédrale est si vivante qu\'elle devient un personnage à part entière.',
      timestamp: new Date('2024-03-09T16:45:00Z').toISOString(),
      book: {
        id: '2',
        title: 'Notre-Dame de Paris',
        author: 'Victor Hugo',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
        rating: 4.5
      },
      reactions: [
        { type: 'thumbsUp', count: 12, reacted: false },
        { type: 'thumbsDown', count: 1, reacted: false },
        { type: 'heart', count: 6, reacted: false }
      ]
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        author: {
          id: '1',
          name: 'Alexandre',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
        },
        content: newMessage,
        timestamp: new Date().toISOString(),
        reactions: [
          { type: 'thumbsUp', count: 0, reacted: false },
          { type: 'thumbsDown', count: 0, reacted: false },
          { type: 'heart', count: 0, reacted: false }
        ],
        spoilerAlert: showQuickNote
      };
      setPosts([newPost, ...posts]);
      setNewMessage('');
      setShowQuickNote(false);
    }
  };

  const handleReaction = (postId: string, reactionType: 'thumbsUp' | 'thumbsDown' | 'heart') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedReactions = post.reactions.map(reaction => {
          if (reaction.type === reactionType) {
            return {
              ...reaction,
              count: reaction.reacted ? reaction.count - 1 : reaction.count + 1,
              reacted: !reaction.reacted
            };
          }
          return reaction;
        });
        return { ...post, reactions: updatedReactions };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Formulaire de publication */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Partagez vos pensées, critiques ou recommandations..."
          className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-malibu-300 focus:outline-none transition-colors resize-none h-32"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              title="Ajouter un livre"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              title="Ajouter une image"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowQuickNote(!showQuickNote)}
              className={`p-2 rounded-full transition-colors ${
                showQuickNote 
                  ? 'text-apricot-500 bg-apricot-50' 
                  : 'text-gray-400 hover:text-apricot-500 hover:bg-apricot-50'
              }`}
              title="Alerte spoiler"
            >
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={postVisibility}
              onChange={(e) => setPostVisibility(e.target.value as 'public' | 'friends' | 'private')}
              className="px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-malibu-300"
            >
              <option value="public">Public</option>
              <option value="friends">Amis</option>
              <option value="private">Privé</option>
            </select>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publier
            </button>
          </div>
        </div>
      </form>

      {/* Liste des posts */}
      {posts.map((post) => (
        <article 
          key={post.id} 
          className={`bg-white rounded-2xl shadow-sm p-6 ${
            post.spoilerAlert ? 'border-2 border-apricot-300' : ''
          }`}
        >
          {post.spoilerAlert && (
            <div className="mb-4 p-2 bg-apricot-50 text-apricot-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Attention : Ce post contient des spoilers !</span>
            </div>
          )}
          
          <div className="flex items-start space-x-4">
            <Link to={`/profile/${post.author.id}`}>
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full hover:opacity-90 transition-opacity"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <Link 
                    to={`/profile/${post.author.id}`}
                    className="font-semibold text-gray-900 hover:text-malibu-500 transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <p className="mt-2 text-gray-600">{post.content}</p>

              {post.book && (
                <div className="mt-4 flex items-center p-4 bg-gray-50 rounded-xl">
                  <Link to={`/book/${post.book.id}`} className="flex-shrink-0">
                    <img
                      src={post.book.cover}
                      alt={post.book.title}
                      className="w-16 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="ml-4">
                    <Link 
                      to={`/book/${post.book.id}`}
                      className="font-semibold text-gray-900 hover:text-malibu-500 transition-colors"
                    >
                      {post.book.title}
                    </Link>
                    <p className="text-sm text-gray-600">{post.book.author}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(post.book.rating)
                              ? 'text-feijoa-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {post.book.rating}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                {post.reactions.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(post.id, reaction.type)}
                    className={`flex items-center gap-1 text-sm ${
                      reaction.reacted ? 'text-apricot-500' : 'text-gray-500'
                    } hover:text-apricot-500 transition-colors`}
                  >
                    {reaction.type === 'thumbsUp' && <ThumbsUp className={`w-5 h-5 ${reaction.reacted ? 'fill-current' : ''}`} />}
                    {reaction.type === 'thumbsDown' && <ThumbsDown className={`w-5 h-5 ${reaction.reacted ? 'fill-current' : ''}`} />}
                    {reaction.type === 'heart' && <Heart className={`w-5 h-5 ${reaction.reacted ? 'fill-current' : ''}`} />}
                    <span>{reaction.count}</span>
                  </button>
                ))}
                <button className="flex items-center gap-2 text-gray-500 hover:text-malibu-500 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>Commenter</span>
                </button>
                {post.book && (
                  <button className="flex items-center gap-2 text-gray-500 hover:text-malibu-500 transition-colors ml-auto">
                    <BookmarkPlus className="w-5 h-5" />
                    <span>Ajouter à ma wishlist</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}