import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, MessageSquare, User, AlertTriangle, Check, X, Shield, Trash2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GroupReportedContentProps {
  groupId: string;
}

export function GroupReportedContent({ groupId }: GroupReportedContentProps) {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'delete' | 'warn' | 'suspend' | 'dismiss'>('delete');

  // Exemple de données pour les signalements
  const reports = [
    {
      id: '1',
      type: 'message',
      content: 'Message inapproprié...',
      reason: 'Contenu offensant',
      reportedBy: {
        id: '2',
        name: 'Marie',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      reportedUser: {
        id: '3',
        name: 'Thomas',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
      },
      date: new Date('2024-03-10'),
      status: 'pending'
    }
  ];

  const handleResolveReport = (reportId: string, action: 'delete' | 'warn' | 'suspend' | 'dismiss') => {
    console.log('Résolution du signalement:', { reportId, action });
    setShowActionModal(false);
    setSelectedReport(null);
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
            <h1 className="text-2xl font-semibold text-gray-900">Contenu signalé</h1>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-xl ${
                    report.status === 'pending'
                      ? 'bg-gray-50'
                      : report.status === 'resolved'
                      ? 'bg-feijoa-50'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        report.type === 'message'
                          ? 'bg-malibu-100 text-malibu-500'
                          : report.type === 'comment'
                          ? 'bg-feijoa-100 text-feijoa-500'
                          : 'bg-apricot-100 text-apricot-500'
                      }`}>
                        {report.type === 'message' && <MessageSquare className="w-5 h-5" />}
                        {report.type === 'comment' && <MessageSquare className="w-5 h-5" />}
                        {report.type === 'user' && <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <img
                            src={report.reportedUser.avatar}
                            alt={report.reportedUser.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <Link
                            to={`/profile/${report.reportedUser.id}`}
                            className="font-medium text-gray-900 hover:text-malibu-500"
                          >
                            {report.reportedUser.name}
                          </Link>
                        </div>
                        <p className="mt-2 text-gray-600">{report.content}</p>
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Raison du signalement :</span> {report.reason}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <img
                              src={report.reportedBy.avatar}
                              alt={report.reportedBy.name}
                              className="w-4 h-4 rounded-full"
                            />
                            <span>Signalé par {report.reportedBy.name}</span>
                            <span>•</span>
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {report.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedReport(report.id);
                          setShowActionModal(true);
                        }}
                        className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                      >
                        Prendre une action
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'action */}
      {showActionModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Action à prendre
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedAction('delete')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedAction === 'delete'
                      ? 'border-apricot-500 bg-apricot-50'
                      : 'border-gray-200 hover:border-apricot-300'
                  }`}
                >
                  <div className="text-center">
                    <Trash2 className={`w-6 h-6 mx-auto mb-2 ${
                      selectedAction === 'delete' ? 'text-apricot-500' : 'text-gray-400'
                    }`} />
                    <p className="font-medium text-gray-900">Supprimer</p>
                    <p className="text-xs text-gray-500">Supprimer le contenu</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAction('warn')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedAction === 'warn'
                      ? 'border-apricot-500 bg-apricot-50'
                      : 'border-gray-200 hover:border-apricot-300'
                  }`}
                >
                  <div className="text-center">
                    <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${
                      selectedAction === 'warn' ? 'text-apricot-500' : 'text-gray-400'
                    }`} />
                    <p className="font-medium text-gray-900">Avertir</p>
                    <p className="text-xs text-gray-500">Envoyer un avertissement</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAction('suspend')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedAction === 'suspend'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="text-center">
                    <Shield className={`w-6 h-6 mx-auto mb-2 ${
                      selectedAction === 'suspend' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <p className="font-medium text-gray-900">Suspendre</p>
                    <p className="text-xs text-gray-500">Suspendre l'utilisateur</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedAction('dismiss')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedAction === 'dismiss'
                      ? 'border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <X className={`w-6 h-6 mx-auto mb-2 ${
                      selectedAction === 'dismiss' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className="font-medium text-gray-900">Rejeter</p>
                    <p className="text-xs text-gray-500">Ignorer le signalement</p>
                  </div>
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedReport(null);
                    setSelectedAction('delete');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleResolveReport(selectedReport, selectedAction)}
                  className={`px-4 py-2 text-white rounded-full transition-colors ${
                    selectedAction === 'suspend'
                      ? 'bg-red-500 hover:bg-red-600'
                      : selectedAction === 'dismiss'
                      ? 'bg-gray-500 hover:bg-gray-600'
                      : 'bg-apricot-500 hover:bg-apricot-600'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}