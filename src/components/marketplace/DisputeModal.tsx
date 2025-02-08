import React, { useState } from 'react';
import { AlertTriangle, Upload, Send, X, Image, FileText, Clock } from 'lucide-react';
import { Dispute, DisputeMessage, DisputeReason } from '../../types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSubmit: (data: {
    reason: DisputeReason;
    description: string;
    evidence: File[];
  }) => void;
}

export function DisputeModal({ isOpen, onClose, orderId, onSubmit }: DisputeModalProps) {
  const [reason, setReason] = useState<DisputeReason>('item_not_received');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Vérification des types de fichiers
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const invalidFile = selectedFiles.find(file => !validTypes.includes(file.type));
    
    if (invalidFile) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG, WEBP ou PDF.');
      return;
    }

    // Vérification de la taille des fichiers (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFile = selectedFiles.find(file => file.size > maxSize);
    
    if (oversizedFile) {
      setError('La taille du fichier ne doit pas dépasser 10MB.');
      return;
    }

    setFiles([...files, ...selectedFiles]);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Veuillez décrire le problème rencontré.');
      return;
    }
    onSubmit({ reason, description, evidence: files });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-apricot-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-apricot-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Ouvrir un litige</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison du litige
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as DisputeReason)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
            >
              <option value="item_not_received">Je n'ai pas reçu ma commande</option>
              <option value="item_not_as_described">L'article ne correspond pas à la description</option>
              <option value="wrong_item">J'ai reçu le mauvais article</option>
              <option value="damaged_item">L'article est endommagé</option>
              <option value="other">Autre problème</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du problème
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              placeholder="Décrivez en détail le problème rencontré..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preuves et photos
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Formats acceptés : JPG, PNG, WEBP, PDF (max 10MB)
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors cursor-pointer inline-block"
                >
                  Ajouter des fichiers
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('image/') ? (
                          <Image className="w-4 h-4 text-gray-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">{file.name}</span>
                      </div>
                      <button
                        type="button"
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
          </div>

          {error && (
            <div className="flex items-center gap-2 text-apricot-500 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Ouvrir le litige
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}