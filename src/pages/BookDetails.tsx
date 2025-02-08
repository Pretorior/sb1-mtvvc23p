import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, MessageSquare, Heart, Share2, AlertCircle, ChevronLeft, User, Shield } from 'lucide-react';
import { MarketplaceBook } from '../types';
import { PaymentButton } from '../components/marketplace/PaymentButton';

interface BookDetailsProps {
  book: MarketplaceBook;
  onBack: () => void;
}

export function BookDetails({ book, onBack }: BookDetailsProps) {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec retour */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour aux annonces
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Photos et infos vendeur */}
          <div className="space-y-6">
            {/* Photo principale */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={book.coverUrl}
                alt={book.title}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>

            {/* Infos vendeur */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={book.seller.avatar}
                    alt={book.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="absolute -top-1 -right-1 bg-feijoa-400 rounded-full p-1">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {book.seller.name}
                    <span className="text-sm font-normal text-gray-500">• Membre depuis 2023</span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-feijoa-400 fill-current" />
                    <span>{book.seller.rating} (42 évaluations)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{book.seller.location} • {book.seller.distance} km</span>
              </div>
              {!showContactForm ? (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Contacter le vendeur
                </button>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message au vendeur..."
                    className="w-full h-32 px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-malibu-300 focus:outline-none transition-colors resize-none"
                  />
                  <button className="w-full px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors">
                    Envoyer le message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite - Détails du livre */}
          <div className="space-y-6">
            {/* Infos principales */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-lg text-gray-600">{book.author}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Heart className="w-6 h-6 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Share2 className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="px-4 py-2 bg-malibu-50 text-malibu-500 rounded-full text-sm font-medium">
                  {book.condition === 'new' ? 'Neuf' :
                   book.condition === 'like-new' ? 'Comme neuf' :
                   book.condition === 'very-good' ? 'Très bon état' :
                   book.condition === 'good' ? 'Bon état' : 'État correct'}
                </div>
                {book.genre.map((g) => (
                  <div key={g} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {g}
                  </div>
                ))}
              </div>

              <div className="border-t border-b border-gray-100 py-6 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ISBN</p>
                    <p className="font-medium">{book.isbn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pages</p>
                    <p className="font-medium">{book.pageCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Édition</p>
                    <p className="font-medium">2022</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">
                  Livre en {book.condition === 'very-good' ? 'très bon état' : 'bon état'}, 
                  quelques légères traces d'usure sur la couverture mais intérieur parfait. 
                  Pas d'annotations ni de pages cornées.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Prix</p>
                  <p className="text-2xl font-semibold text-gray-900">{book.price}€</p>
                </div>
                <PaymentButton 
                  book={book}
                  onPaymentComplete={() => {
                    navigate('/marketplace/dashboard');
                  }}
                />
              </div>

              <div className="flex items-start gap-3 text-sm text-gray-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  Paiement sécurisé via notre plateforme. L'argent est conservé jusqu'à 
                  ce que vous confirmiez la bonne réception du livre.
                </p>
              </div>
            </div>

            {/* Notes et annotations */}
            {book.notes && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Notes du vendeur</h3>
                <p className="text-gray-600">{book.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}