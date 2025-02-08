import React, { useState } from 'react';
import { 
  AlertTriangle, MessageSquare, Upload, Send, X, Image, 
  FileText, Clock, Check, ChevronLeft, Shield 
} from 'lucide-react';
import { Dispute, DisputeMessage } from '../../types';
import { Link } from 'react-router-dom';

interface DisputeDetailsProps {
  dispute: Dispute;
  onBack: () => void;
  onSendMessage: (content: string, files?: File[]) => void;
  onAcceptResolution: () => void;
  onRejectResolution: () => void;
}

export function DisputeDetails({
  dispute,
  onBack,
  onSendMessage,
  onAcceptResolution,
  onRejectResolution
}: DisputeDetailsProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  const getStatusColor = () => {
    switch (dispute.status) {
      case 'opened':
        return 'bg-apricot-100 text-apricot-500';
      case 'seller_response':
        return 'bg-malibu-100 text-malibu-500';
      case 'mediation':
        return 'bg-feijoa-100 text-feijoa-500';
      case 'resolved':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (dispute.status) {
      case 'opened':
        return 'Litige ouvert';
      case 'seller_response':
        return 'En attente de réponse du vendeur';
      case 'mediation':
        return 'En médiation';
      case 'resolved':
        return 'Résolu';
      case 'cancelled':
        return 'Annulé';
      default:
        return dispute.status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour aux litiges
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails du litige */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-apricot-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-apricot-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Litige #{dispute.id}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
                        {getStatusText()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Ouvert le {dispute.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {dispute.status === 'resolved' && (
                  <div className="flex items-center gap-2 text-feijoa-500">
                    <Check className="w-5 h-5" />
                    <span>Résolu</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Raison du litige
                  </h3>
                  <p className="text-gray-900">{dispute.description}</p>
                </div>

                {dispute.evidence.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Preuves fournies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {dispute.evidence.map((item) => (
                        <div
                          key={item.id}
                          className="relative group"
                        >
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-sm hover:underline"
                            >
                              Voir le fichier
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Messages
                  </h3>
                  <div className="space-y-4">
                    {dispute.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${
                          message.isFromSupport ? 'bg-malibu-50' : 'bg-gray-50'
                        } rounded-xl p-4`}
                      >
                        {message.isFromSupport && (
                          <div className="p-2 bg-malibu-100 rounded-lg h-fit">
                            <Shield className="w-5 h-5 text-malibu-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {message.isFromSupport ? 'Support' : 'Vous'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {message.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-gray-100"
                                >
                                  {attachment.type === 'image' ? (
                                    <Image className="w-4 h-4" />
                                  ) : (
                                    <FileText className="w-4 h-4" />
                                  )}
                                  {attachment.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formulaire de message */}
                  {dispute.status !== 'resolved' && dispute.status !== 'cancelled' && (
                    <div className="mt-4">
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Votre message..."
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-24"
                          />
                          {files.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {files.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                  {file.type.startsWith('image/') ? (
                                    <Image className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-gray-500" />
                                  )}
                                  <span className="text-gray-600">{file.name}</span>
                                  <button
                                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            className="hidden"
                            id="message-file"
                            multiple
                          />
                          <label
                            htmlFor="message-file"
                            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
                          >
                            <Upload className="w-5 h-5" />
                          </label>
                          <button
                            onClick={handleSendMessage}
                            disabled={!message.trim() && files.length === 0}
                            className="p-3 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations latérales */}
          <div className="space-y-6">
            {/* Résolution proposée */}
            {dispute.resolution && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Résolution proposée
                </h3>
                <div className="p-4 bg-feijoa-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-feijoa-100 rounded-lg">
                      <Check className="w-5 h-5 text-feijoa-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {dispute.resolution === 'full_refund' && 'Remboursement total'}
                        {dispute.resolution === 'partial_refund' && 'Remboursement partiel'}
                        {dispute.resolution === 'return_item' && 'Retour de l\'article'}
                        {dispute.resolution === 'keep_item' && 'Conserver l\'article'}
                      </p>
                      {dispute.amount && (
                        <p className="text-sm text-gray-600 mt-1">
                          Montant : {dispute.amount}€
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={onAcceptResolution}
                      className="flex-1 px-4 py-2 bg-feijoa-500 text-white rounded-full hover:bg-feijoa-600 transition-colors"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={onRejectResolution}
                      className="flex-1 px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chronologie */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chronologie
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-apricot-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-apricot-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Litige ouvert</p>
                    <p className="text-sm text-gray-500">
                      {dispute.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {dispute.status === 'seller_response' && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-malibu-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-malibu-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        En attente de réponse du vendeur
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {dispute.status === 'mediation' && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-feijoa-100 rounded-lg">
                      <Shield className="w-5 h-5 text-feijoa-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Intervention du service client
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {dispute.resolvedAt && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Check className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Litige résolu</p>
                      <p className="text-sm text-gray-500">
                        {new Date(dispute.resolvedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations utiles */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations utiles
              </h3>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  • Notre équipe examine chaque litige sous 24-48h ouvrées
                </p>
                <p>
                  • Les fonds sont bloqués jusqu'à la résolution du litige
                </p>
                <p>
                  • Privilégiez toujours une résolution à l'amiable
                </p>
                <Link
                  to="/help/disputes"
                  className="text-malibu-500 hover:text-malibu-600 block mt-4"
                >
                  En savoir plus sur la gestion des litiges
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}