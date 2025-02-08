import React, { useState } from 'react';
import { Package, Clock, CheckCircle, AlertTriangle, DollarSign, TrendingUp, Users, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

type TransactionStatus = 
  | 'pending_payment'
  | 'payment_received' 
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'cancelled';

interface Transaction {
  id: string;
  type: 'sale' | 'purchase';
  bookId: string;
  bookTitle: string;
  bookCover: string;
  price: number;
  status: TransactionStatus;
  date: Date;
  otherParty: {
    id: string;
    name: string;
    avatar: string;
  };
  shipping?: {
    method: 'mondial_relay' | 'colissimo' | 'hand_delivery';
    trackingNumber?: string;
    trackingUrl?: string;
  };
  messages: number;
}

export function MarketplaceDashboard() {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>('sales');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Exemple de données
  const stats = {
    sales: {
      total: 15,
      revenue: 187.50,
      averagePrice: 12.50,
      positiveRatings: 14,
      responseRate: 98
    },
    purchases: {
      total: 8,
      spent: 95.80,
      averagePrice: 11.97,
      positiveRatings: 8
    }
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sale',
      bookId: '1',
      bookTitle: 'Les Misérables',
      bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
      price: 12.50,
      status: 'shipping',
      date: new Date('2024-03-10'),
      otherParty: {
        id: '2',
        name: 'Marie',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      shipping: {
        method: 'colissimo',
        trackingNumber: '9L12345678',
        trackingUrl: 'https://www.laposte.fr/outils/suivre-vos-envois?code=9L12345678'
      },
      messages: 3
    }
  ];

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-malibu-100 text-malibu-500';
      case 'payment_received':
        return 'bg-feijoa-100 text-feijoa-500';
      case 'shipping':
        return 'bg-malibu-100 text-malibu-500';
      case 'delivered':
        return 'bg-feijoa-100 text-feijoa-500';
      case 'completed':
        return 'bg-feijoa-100 text-feijoa-500';
      case 'disputed':
        return 'bg-apricot-100 text-apricot-500';
      case 'cancelled':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'En attente de paiement';
      case 'payment_received':
        return 'Paiement reçu';
      case 'shipping':
        return 'En cours d\'expédition';
      case 'delivered':
        return 'Livré';
      case 'completed':
        return 'Terminé';
      case 'disputed':
        return 'Litige';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (transaction.type !== activeTab) return false;
    if (statusFilter !== 'all' && transaction.status !== statusFilter) return false;
    
    const date = new Date(transaction.date);
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        return date >= new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return date >= new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return date >= new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <div className="flex gap-4">
            <Link
              to="/marketplace/disputes"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
            >
              <Shield className="w-5 h-5" />
              Litiges
            </Link>
            <Link
              to="/marketplace/new"
              className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Mettre en vente
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-malibu-100 rounded-lg">
                <Package className="w-5 h-5 text-malibu-500" />
              </div>
              <span className="text-sm text-gray-500">
                {activeTab === 'sales' ? 'Ventes' : 'Achats'} totaux
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-4">
              {activeTab === 'sales' ? stats.sales.total : stats.purchases.total}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-feijoa-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-feijoa-500" />
              </div>
              <span className="text-sm text-gray-500">
                {activeTab === 'sales' ? 'Revenus' : 'Dépenses'}
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-4">
              {activeTab === 'sales' ? stats.sales.revenue : stats.purchases.spent}€
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-apricot-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-apricot-500" />
              </div>
              <span className="text-sm text-gray-500">Prix moyen</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-4">
              {activeTab === 'sales' ? stats.sales.averagePrice : stats.purchases.averagePrice}€
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Star className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-sm text-gray-500">Avis positifs</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-4">
              {activeTab === 'sales' ? stats.sales.positiveRatings : stats.purchases.positiveRatings}
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === 'sales'
                    ? 'bg-malibu-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ventes
              </button>
              <button
                onClick={() => setActiveTab('purchases')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === 'purchases'
                    ? 'bg-malibu-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Achats
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  timeRange === 'week'
                    ? 'bg-malibu-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7 derniers jours
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  timeRange === 'month'
                    ? 'bg-malibu-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                30 derniers jours
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  timeRange === 'year'
                    ? 'bg-malibu-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                12 derniers mois
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
              className="px-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending_payment">En attente de paiement</option>
              <option value="payment_received">Paiement reçu</option>
              <option value="shipping">En cours d'expédition</option>
              <option value="delivered">Livré</option>
              <option value="completed">Terminé</option>
              <option value="disputed">Litige</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-6">
                <Link to={`/marketplace/book/${transaction.bookId}`}>
                  <img
                    src={transaction.bookCover}
                    alt={transaction.bookTitle}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/marketplace/book/${transaction.bookId}`}
                        className="font-medium text-gray-900 hover:text-malibu-500"
                      >
                        {transaction.bookTitle}
                      </Link>
                      <div className="flex items-center gap-4 mt-2">
                        <Link
                          to={`/profile/${transaction.otherParty.id}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-malibu-500"
                        >
                          <img
                            src={transaction.otherParty.avatar}
                            alt={transaction.otherParty.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{transaction.otherParty.name}</span>
                        </Link>
                        <span className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        {transaction.price}€
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </div>

                  {transaction.shipping && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.shipping.method === 'mondial_relay' ? 'Mondial Relay' :
                             transaction.shipping.method === 'colissimo' ? 'Colissimo' : 'Remise en main propre'}
                          </p>
                          {transaction.shipping.trackingNumber && (
                            <p className="text-sm text-gray-600 mt-1">
                              N° de suivi : {transaction.shipping.trackingNumber}
                            </p>
                          )}
                        </div>
                        {transaction.shipping.trackingUrl && (
                          <a
                            href={transaction.shipping.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                          >
                            Suivre le colis
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    <Link
                      to={`/messages?user=${transaction.otherParty.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-malibu-500 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      Messages
                      {transaction.messages > 0 && (
                        <span className="px-2 py-0.5 bg-malibu-100 text-malibu-500 rounded-full text-xs">
                          {transaction.messages}
                        </span>
                      )}
                    </Link>
                    {transaction.status === 'delivered' && (
                      <button className="px-4 py-2 bg-feijoa-500 text-white rounded-full hover:bg-feijoa-600 transition-colors">
                        Confirmer la réception
                      </button>
                    )}
                    {transaction.status === 'completed' && (
                      <button className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors">
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}