import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Filter, Search, Shield, Check, X } from 'lucide-react';
import { Dispute } from '../types';
import { DisputeDetails } from '../components/marketplace/DisputeDetails';

export function DisputesPage() {
  const navigate = useNavigate();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Dispute['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Exemple de données
  const disputes: Dispute[] = [
    {
      id: '1',
      orderId: 'ORD-123',
      buyerId: '1',
      sellerId: '2',
      reason: 'item_not_received',
      description: 'Je n\'ai toujours pas reçu ma commande après 2 semaines.',
      status: 'opened',
      messages: [],
      evidence: [],
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    }
  ];

  const filteredDisputes = disputes.filter(dispute => {
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesSearch = dispute.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendMessage = (disputeId: string, content: string, files?: File[]) => {
    console.log('Envoi du message:', { disputeId, content, files });
  };

  const handleAcceptResolution = (disputeId: string) => {
    console.log('Acceptation de la résolution:', disputeId);
  };

  const handleRejectResolution = (disputeId: string) => {
    console.log('Refus de la résolution:', disputeId);
  };

  if (selectedDispute) {
    return (
      <DisputeDetails
        dispute={selectedDispute}
        onBack={() => setSelectedDispute(null)}
        onSendMessage={(content, files) => handleSendMessage(selectedDispute.id, content, files)}
        onAcceptResolution={() => handleAcceptResolution(selectedDispute.id)}
        onRejectResolution={() => handleRejectResolution(selectedDispute.id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Mes litiges</h1>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par numéro de commande..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 border-2 border-gray-100 rounded-full focus:border-malibu-300 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="opened">Ouverts</option>
              <option value="seller_response">En attente de réponse</option>
              <option value="mediation">En médiation</option>
              <option value="resolved">Résolus</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>

        {/* Liste des litiges */}
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <div
              key={dispute.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDispute(dispute)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    dispute.status === 'opened' ? 'bg-apricot-100' :
                    dispute.status === 'seller_response' ? 'bg-malibu-100' :
                    dispute.status === 'mediation' ? 'bg-feijoa-100' :
                    'bg-gray-100'
                  }`}>
                    {dispute.status === 'opened' && <AlertTriangle className="w-5 h-5 text-apricot-500" />}
                    {dispute.status === 'seller_response' && <Shield className="w-5 h-5 text-malibu-500" />}
                    {dispute.status === 'mediation' && <Shield className="w-5 h-5 text-feijoa-500" />}
                    {dispute.status === 'resolved' && <Check className="w-5 h-5 text-gray-500" />}
                    {dispute.status === 'cancelled' && <X className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        Commande #{dispute.orderId}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        dispute.status === 'opened' ? 'bg-apricot-100 text-apricot-500' :
                        dispute.status === 'seller_response' ? 'bg-malibu-100 text-malibu-500' :
                        dispute.status === 'mediation' ? 'bg-feijoa-100 text-feijoa-500' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {dispute.status === 'opened' && 'Ouvert'}
                        {dispute.status === 'seller_response' && 'En attente de réponse'}
                        {dispute.status === 'mediation' && 'En médiation'}
                        {dispute.status === 'resolved' && 'Résolu'}
                        {dispute.status === 'cancelled' && 'Annulé'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Ouvert le {dispute.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mt-2">{dispute.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {dispute.messages.length > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{dispute.messages.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredDisputes.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun litige trouvé
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Aucun litige ne correspond à votre recherche'
                  : 'Vous n\'avez aucun litige en cours'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}