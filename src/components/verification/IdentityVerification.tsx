import React, { useState } from 'react';
import { Shield, Upload, Check, AlertCircle, X } from 'lucide-react';

interface IdentityVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
}

export function IdentityVerification({ isOpen, onClose, onSubmit }: IdentityVerificationProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [verificationMethod, setVerificationMethod] = useState<'document' | 'stripe'>('document');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Vérification des types de fichiers
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const invalidFile = selectedFiles.find(file => !validTypes.includes(file.type));
    
    if (invalidFile) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG ou PDF.');
      return;
    }

    // Vérification de la taille des fichiers (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFile = selectedFiles.find(file => file.size > maxSize);
    
    if (oversizedFile) {
      setError('La taille du fichier ne doit pas dépasser 5MB.');
      return;
    }

    setFiles(selectedFiles);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationMethod === 'document' && files.length === 0) {
      setError('Veuillez sélectionner au moins un document.');
      return;
    }
    onSubmit(files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Vérification d'identité</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Méthodes de vérification */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Choisissez une méthode de vérification
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setVerificationMethod('document')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  verificationMethod === 'document'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Upload className={`w-6 h-6 mx-auto mb-2 ${
                  verificationMethod === 'document' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <p className="font-medium text-gray-900">Document d'identité</p>
                <p className="text-xs text-gray-500">
                  Envoyez une pièce d'identité officielle
                </p>
              </button>

              <button
                onClick={() => setVerificationMethod('stripe')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  verificationMethod === 'stripe'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Shield className={`w-6 h-6 mx-auto mb-2 ${
                  verificationMethod === 'stripe' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <p className="font-medium text-gray-900">Stripe Identity</p>
                <p className="text-xs text-gray-500">
                  Vérification via Stripe Identity
                </p>
              </button>
            </div>
          </div>

          {verificationMethod === 'document' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document d'identité
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Formats acceptés : JPG, PNG, PDF (max 5MB)
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      id="file-upload"
                      multiple
                    />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors cursor-pointer inline-block"
                    >
                      Sélectionner un fichier
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
                            <Check className="w-4 h-4 text-feijoa-500" />
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
                  <AlertCircle className="w-4 h-4" />
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
                  Envoyer pour vérification
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Vous allez être redirigé vers Stripe Identity pour compléter la vérification de votre identité de manière sécurisée.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Intégration avec Stripe Identity
                    console.log('Redirection vers Stripe Identity');
                  }}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Continuer avec Stripe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}