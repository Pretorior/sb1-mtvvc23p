import React, { useState } from 'react';
import { ShoppingBag, Share2, Users, MessageSquare, Archive, List, Heart, DollarSign, Tag, X } from 'lucide-react';
import { Book, SharedShelf } from '../../types';
import { useNavigate } from 'react-router-dom';

interface BookActionsProps {
  book: Book;
  shelves?: SharedShelf[];
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onShareToFeed?: (bookId: string, message: string) => void;
  onAddToShelf?: (bookId: string, shelfId: string) => void;
}

export function BookActions({ 
  book, 
  shelves = [],
  onUpdateBook, 
  onShareToFeed,
  onAddToShelf 
}: BookActionsProps) {
  const navigate = useNavigate();
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleInfo, setSaleInfo] = useState({
    price: '',
    condition: 'very-good' as const,
    description: '',
    exchangePossible: false,
    location: ''
  });

  const handlePutForSale = () => {
    const price = parseFloat(saleInfo.price);
    if (!isNaN(price) && price > 0) {
      onUpdateBook(book.id, {
        status: 'for-sale',
        forSale: {
          price,
          condition: saleInfo.condition,
          description: saleInfo.description,
          location: saleInfo.location,
          exchangePossible: saleInfo.exchangePossible,
          listedDate: new Date()
        }
      });
      setShowSaleModal(false);
      // Rediriger vers le dashboard du marketplace
      navigate('/marketplace/dashboard');
    }
  };

  const handleRemoveFromSale = () => {
    onUpdateBook(book.id, {
      status: 'completed',
      forSale: undefined
    });
  };

  return (
    <div className="flex gap-2">
      {/* Bouton Mettre en vente / Retirer de la vente */}
      {book.status === 'for-sale' ? (
        <button
          onClick={handleRemoveFromSale}
          className="flex items-center gap-2 px-4 py-2 text-apricot-500 hover:bg-apricot-50 rounded-full transition-colors"
        >
          <Tag className="w-5 h-5" />
          Retirer de la vente
        </button>
      ) : (
        <button
          onClick={() => setShowSaleModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-feijoa-500 hover:bg-feijoa-50 rounded-full transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Mettre en vente
        </button>
      )}

      {/* Modal de mise en vente */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Mettre en vente "{book.title}"
              </h3>
              <button
                onClick={() => setShowSaleModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={saleInfo.price}
                    onChange={(e) => setSaleInfo({ ...saleInfo, price: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État
                </label>
                <select
                  value={saleInfo.condition}
                  onChange={(e) => setSaleInfo({ ...saleInfo, condition: e.target.value as Book['forSale']['condition'] })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="new">Neuf</option>
                  <option value="like-new">Comme neuf</option>
                  <option value="very-good">Très bon état</option>
                  <option value="good">Bon état</option>
                  <option value="acceptable">État correct</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={saleInfo.description}
                  onChange={(e) => setSaleInfo({ ...saleInfo, description: e.target.value })}
                  placeholder="Décrivez l'état du livre, les éventuelles marques d'usure..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  value={saleInfo.location}
                  onChange={(e) => setSaleInfo({ ...saleInfo, location: e.target.value })}
                  placeholder="Ville ou code postal"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={saleInfo.exchangePossible}
                  onChange={(e) => setSaleInfo({ ...saleInfo, exchangePossible: e.target.checked })}
                  className="rounded border-gray-300 text-malibu-500 focus:ring-malibu-500"
                />
                <span className="text-sm text-gray-700">
                  Échange possible
                </span>
              </label>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePutForSale}
                  disabled={!saleInfo.price || !saleInfo.location}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mettre en vente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}