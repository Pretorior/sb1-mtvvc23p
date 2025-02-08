import React, { useState } from 'react';
import { MapPin, Filter, Search, SlidersHorizontal, BookOpen, Star, Plus } from 'lucide-react';
import { MarketplaceBook } from '../types';
import { BookDetails } from './BookDetails';
import { BookListingForm } from '../components/marketplace/BookListingForm';
import { Link } from 'react-router-dom';

export function Marketplace() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [maxDistance, setMaxDistance] = useState(10);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<MarketplaceBook | null>(null);
  const [showListingForm, setShowListingForm] = useState(false);

  const sampleBooks: MarketplaceBook[] = [
    {
      id: '1',
      isbn: '9780123456789',
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
      pageCount: 96,
      genre: ['Classic', 'Children'],
      status: 'completed',
      progress: { currentPage: 96 },
      seller: {
        name: 'Marie',
        rating: 4.8,
        distance: 2.3,
        location: 'Paris 11e',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      price: 8,
      condition: 'very-good',
      notes: 'J\'ai adoré ce livre et l\'ai lu plusieurs fois. Les illustrations sont magnifiques et l\'histoire est intemporelle.'
    }
  ];

  const handleCreateListing = (listing: any) => {
    console.log('Nouvelle annonce:', listing);
    setShowListingForm(false);
  };

  if (selectedBook) {
    return <BookDetails book={selectedBook} onBack={() => setSelectedBook(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Marché Local</h1>
            <div className="flex gap-4">
              <Link
                to="/marketplace/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              >
                Tableau de bord
              </Link>
              <button 
                onClick={() => setShowListingForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Mettre en vente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un livre, un auteur..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  viewMode === 'list' 
                    ? 'bg-malibu-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('list')}
              >
                <BookOpen className="w-5 h-5" />
                Liste
              </button>
              <button 
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  viewMode === 'map' 
                    ? 'bg-malibu-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('map')}
              >
                <MapPin className="w-5 h-5" />
                Carte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance maximale
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 min-w-[3rem]">{maxDistance} km</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fourchette de prix
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border border-gray-200 rounded-md"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-20 px-2 py-1 border border-gray-200 rounded-md"
                  />
                  <span>€</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État du livre
                </label>
                {['Neuf', 'Comme neuf', 'Très bon', 'Bon', 'Correct'].map((condition) => (
                  <label key={condition} className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedConditions([...selectedConditions, condition]);
                        } else {
                          setSelectedConditions(selectedConditions.filter(c => c !== condition));
                        }
                      }}
                      className="rounded border-gray-300 text-malibu-500 focus:ring-malibu-500"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genres
                </label>
                {['Roman', 'SF', 'Fantasy', 'Polar', 'Manga'].map((genre) => (
                  <label key={genre} className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGenres([...selectedGenres, genre]);
                        } else {
                          setSelectedGenres(selectedGenres.filter(g => g !== genre));
                        }
                      }}
                      className="rounded border-gray-300 text-malibu-500 focus:ring-malibu-500"
                    />
                    <span className="text-sm text-gray-700">{genre}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-[3/4]">
                    <img 
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {book.price}€
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-feijoa-400 fill-current" />
                      <span className="text-sm text-gray-700">{book.seller.rating}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-700">{book.seller.distance} km</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors">
                        Acheter
                      </button>
                      <button 
                        onClick={() => setSelectedBook(book)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showListingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mettre en vente un livre</h2>
            <BookListingForm
              onSubmit={handleCreateListing}
              onClose={() => setShowListingForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}