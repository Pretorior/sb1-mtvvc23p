import React, { useState } from 'react';
import { Upload, X, Lock, Users, Globe } from 'lucide-react';

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: {
    name: string;
    description: string;
    theme: string;
    coverUrl: string;
    visibility: 'public' | 'private' | 'invite-only';
    rules: string[];
  }) => void;
}

export function GroupCreationModal({ isOpen, onClose, onCreateGroup }: GroupCreationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'invite-only'>('public');
  const [rules, setRules] = useState<string[]>([
    'Respecter les autres membres',
    'Pas de spoilers sans avertissement',
    'Pas de spam ou de publicité'
  ]);
  const [newRule, setNewRule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description && theme) {
      onCreateGroup({
        name,
        description,
        theme,
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000',
        visibility,
        rules
      });
      onClose();
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Créer un groupe de lecture</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Club des Classiques"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'objectif et l'ambiance de votre groupe..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thème principal
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
              required
            >
              <option value="">Sélectionner un thème</option>
              <option value="classics">Classiques</option>
              <option value="contemporary">Littérature contemporaine</option>
              <option value="fantasy">Fantasy & Science-Fiction</option>
              <option value="mystery">Polar & Thriller</option>
              <option value="romance">Romance</option>
              <option value="nonfiction">Non-fiction</option>
              <option value="poetry">Poésie</option>
              <option value="manga">Manga & BD</option>
            </select>
          </div>

          {/* Image de couverture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture (optionnel)
            </label>
            <div className="flex gap-4">
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="Couverture du groupe"
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="URL de l'image..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Visibilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilité du groupe
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  visibility === 'public'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Globe className={`w-5 h-5 ${
                  visibility === 'public' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Public</p>
                  <p className="text-xs text-gray-500">Tout le monde peut rejoindre</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  visibility === 'private'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Lock className={`w-5 h-5 ${
                  visibility === 'private' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Privé</p>
                  <p className="text-xs text-gray-500">Sur approbation uniquement</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('invite-only')}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  visibility === 'invite-only'
                    ? 'border-malibu-500 bg-malibu-50'
                    : 'border-gray-200 hover:border-malibu-300'
                }`}
              >
                <Users className={`w-5 h-5 ${
                  visibility === 'invite-only' ? 'text-malibu-500' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Sur invitation</p>
                  <p className="text-xs text-gray-500">Membres invités uniquement</p>
                </div>
              </button>
            </div>
          </div>

          {/* Règles du groupe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Règles du groupe
            </label>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                    {rule}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="p-2 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Ajouter une règle..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addRule}
                  className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
            >
              Créer le groupe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}