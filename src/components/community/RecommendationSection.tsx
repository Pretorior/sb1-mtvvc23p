import React, { useState } from 'react';
import { MessageSquare, Star, TrendingUp } from 'lucide-react';

interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  description: string;
  recommendedBy: {
    name: string;
    avatar: string;
  };
  tags: string[];
  matchScore: number;
}

const sampleRecommendations: BookRecommendation[] = [
  {
    id: '1',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    description: 'Un chef-d\'œuvre intemporel qui explore la justice, la rédemption et l\'amour dans le Paris du XIXe siècle.',
    recommendedBy: {
      name: 'Marie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    },
    tags: ['Classique', 'Historique', 'Drame'],
    matchScore: 95,
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300',
    rating: 4.7,
    description: 'Une épopée de science-fiction qui mêle politique, religion et écologie dans un univers fascinant.',
    recommendedBy: {
      name: 'Thomas',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    },
    tags: ['Science-Fiction', 'Space Opera', 'Politique'],
    matchScore: 88,
  },
];

export function RecommendationSection() {
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [recommendations] = useState(sampleRecommendations);

  return (
    <div className="space-y-8">
      {/* En-tête avec bouton de demande */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Recommandations personnalisées</h2>
          <p className="text-gray-600 mt-1">
            Basées sur vos lectures et vos préférences
          </p>
        </div>
        <button
          onClick={() => setShowRecommendationForm(true)}
          className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          Demander une recommandation
        </button>
      </div>

      {/* Formulaire de demande de recommandation */}
      {showRecommendationForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Demander une recommandation
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Que recherchez-vous ?
              </label>
              <textarea
                placeholder="Ex: Je cherche un roman historique se déroulant pendant la Renaissance..."
                className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-malibu-300 focus:outline-none transition-colors resize-none h-32"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Roman', 'SF', 'Fantasy', 'Policier', 'Historique'].map((genre) => (
                <label
                  key={genre}
                  className="flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <input type="checkbox" className="mr-2" />
                  {genre}
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowRecommendationForm(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
              >
                Publier la demande
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((book) => (
          <div key={book.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex p-6">
              <img
                src={book.cover}
                alt={book.title}
                className="w-32 h-48 object-cover rounded-lg"
              />
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
                  <div className="flex items-center bg-feijoa-50 text-feijoa-500 px-3 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {book.matchScore}% match
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(book.rating)
                          ? 'text-feijoa-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{book.rating}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{book.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={book.recommendedBy.avatar}
                  alt={book.recommendedBy.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Recommandé par {book.recommendedBy.name}
                </span>
              </div>
              <button className="flex items-center text-malibu-500 hover:text-malibu-600 transition-colors">
                <MessageSquare className="w-5 h-5 mr-1" />
                Discuter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}