import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Shield, UserMinus, AlertTriangle, ChevronLeft } from 'lucide-react';

interface GroupMemberManagerProps {
  groupId: string;
}

export function GroupMemberManager({ groupId }: GroupMemberManagerProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [showWarnModal, setShowWarnModal] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [warnReason, setWarnReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('7');

  // Exemple de données pour les membres
  const members = [
    {
      id: '1',
      name: 'Alexandre',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      role: 'admin',
      joinDate: new Date('2024-01-01'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Marie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      role: 'moderator',
      joinDate: new Date('2024-02-01'),
      status: 'active'
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateRole = (memberId: string, role: string) => {
    console.log('Mise à jour du rôle:', { memberId, role });
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Retrait du membre:', memberId);
    setShowRemoveConfirm(null);
  };

  const handleWarnMember = (memberId: string) => {
    if (warnReason.trim()) {
      console.log('Avertissement du membre:', { memberId, reason: warnReason });
      setShowWarnModal(null);
      setWarnReason('');
    }
  };

  const handleSuspendMember = (memberId: string) => {
    if (suspendReason.trim()) {
      console.log('Suspension du membre:', { memberId, duration: suspendDuration, reason: suspendReason });
      setShowSuspendModal(null);
      setSuspendReason('');
      setSuspendDuration('7');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/community/group/${groupId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour au groupe
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Gestion des membres</h1>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un membre..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-malibu-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">
                        Membre depuis {new Date(member.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Statut */}
                    {member.status !== 'active' && (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        member.status === 'warned'
                          ? 'bg-apricot-100 text-apricot-500'
                          : 'bg-red-100 text-red-500'
                      }`}>
                        {member.status === 'warned' ? 'Averti' : 'Suspendu'}
                      </span>
                    )}

                    {/* Rôle */}
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                      className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:border-malibu-300 focus:outline-none text-sm"
                    >
                      <option value="member">Membre</option>
                      <option value="moderator">Modérateur</option>
                      <option value="admin">Administrateur</option>
                    </select>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowWarnModal(member.id)}
                        className="p-2 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50"
                        title="Avertir"
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowSuspendModal(member.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                        title="Suspendre"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowRemoveConfirm(member.id)}
                        className="p-2 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50"
                        title="Retirer"
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modales de confirmation */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Retirer ce membre ?
            </h3>
            <p className="text-gray-600 mb-6">
              Le membre sera retiré du groupe et n'aura plus accès aux discussions et événements.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => handleRemoveMember(showRemoveConfirm)}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'avertissement */}
      {showWarnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Avertir ce membre
            </h3>
            <div className="space-y-4">
              <textarea
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                placeholder="Raison de l'avertissement..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowWarnModal(null);
                    setWarnReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleWarnMember(showWarnModal)}
                  className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
                >
                  Avertir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suspension */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Suspendre ce membre
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée de la suspension
                </label>
                <select
                  value={suspendDuration}
                  onChange={(e) => setSuspendDuration(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="1">1 jour</option>
                  <option value="3">3 jours</option>
                  <option value="7">1 semaine</option>
                  <option value="30">1 mois</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Raison de la suspension..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowSuspendModal(null);
                    setSuspendReason('');
                    setSuspendDuration('7');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSuspendMember(showSuspendModal)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  Suspendre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}