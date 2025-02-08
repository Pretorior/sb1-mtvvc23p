import React, { useState } from 'react';
import { ShoppingBag, Filter, Search, Plus } from 'lucide-react';
import { MarketplacePost } from '../social/MarketplacePost';

interface GroupMarketplaceProps {
  groupId: string;
  onCreateListing: (listing: any) => void;
}

export function GroupMarketplace({ groupId, onCreateListing }: GroupMarketplaceProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Vente & Échange</h2>
          <p className="text-gray-600 mt-1">
            Vendez ou échangez vos livres avec les membres du groupe
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer une annonce
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un livre..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
          />
        </div>
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="px-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
        >
          <option value="">Tous les états</option>
          <option value="new">Neuf</option>
          <option value="like-new">Comme neuf</option>
          <option value="very-good">Très bon état</option>
          <option value="good">Bon état</option>
          <option value="acceptable">État correct</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            placeholder="Min"
            className="w-20 px-3 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            placeholder="Max"
            className="w-20 px-3 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
          />
          <span>€</span>
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="space-y-6">
        {/* Exemple d'annonce */}
        <MarketplacePost
          post={{
            id: '1',
            seller: {
              id: '2',
              name: 'Marie',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
            },
            book: {
              id: '1',
              isbn: '9780123456789',
              title: 'Les Misérables',
              author: 'Victor Hugo',
              coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
              pageCount: 1488,
              genre: ['Classique', 'Roman historique'],
              status: 'for-sale',
              progress: { currentPage: 0 },
              price: 15,
              condition: 'very-good',
              description: 'Édition de poche en très bon état, quelques annotations au crayon effaçables',
              location: 'Paris'
            },
            timestamp: new Date('2024-03-10'),
            likes: 5,
            liked: false,
            comments: 2
          }}
          onLike={() => {}}
          onAddToLibrary={() => {}}
          onShare={() => {}}
        />
      </div>

      {/* Modal de création d'annonce */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Créer une annonce
            </h3>
            <form className="space-y-4">
              {/* Formulaire de création d'annonce */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Publier l'annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}