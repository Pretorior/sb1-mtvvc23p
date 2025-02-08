import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Globe, Trash2, AlertTriangle, Shield, Settings, ChevronLeft } from 'lucide-react';

interface GroupSettingsProps {
  group: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    visibility: 'public' | 'private' | 'invite-only';
    members: {
      id: string;
      name: string;
      avatar: string;
      role: 'admin' | 'moderator' | 'member';
      joinDate: Date;
    }[];
    rules: string[];
  };
  onUpdateGroup: (updates: Partial<typeof GroupSettingsProps.group>) => void;
  onDeleteGroup: () => void;
  onUpdateMemberRole: (memberId: string, role: 'admin' | 'moderator' | 'member') => void;
  onRemoveMember: (memberId: string) => void;
}

export function GroupSettings({ group, onUpdateGroup, onDeleteGroup, onUpdateMemberRole, onRemoveMember }: GroupSettingsProps) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState<string | null>(null);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [coverUrl, setCoverUrl] = useState(group.coverUrl);
  const [visibility, setVisibility] = useState(group.visibility);
  const [rules, setRules] = useState(group.rules);
  const [newRule, setNewRule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGroup({
      name,
      description,
      coverUrl,
      visibility,
      rules
    });
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/community/group/${group.id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour au groupe
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Paramètres du groupe</h1>
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informations de base */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du groupe
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image de couverture
                  </label>
                  <div className="flex gap-4">
                    {coverUrl && (
                      <img
                        src={coverUrl}
                        alt="Couverture du groupe"
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    )}
                    <input
                      type="text"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                      placeholder="URL de l'image..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibilité */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Visibilité</h2>
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

            {/* Règles */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Règles du groupe</h2>
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
                      <Trash2 className="w-4 h-4" />
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

            {/* Gestion des membres */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Membres</h2>
              <div className="space-y-4">
                {group.members.map((member) => (
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
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => onUpdateMemberRole(member.id, e.target.value as 'admin' | 'moderator' | 'member')}
                        className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:border-malibu-300 focus:outline-none text-sm"
                      >
                        <option value="member">Membre</option>
                        <option value="moderator">Modérateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                      <button
                        onClick={() => setShowRemoveMemberConfirm(member.id)}
                        className="p-2 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-apricot-500 hover:bg-apricot-50 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer le groupe
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-4 text-apricot-500 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-semibold">Supprimer le groupe ?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. Tous les messages, discussions et événements seront définitivement supprimés.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteGroup();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression de membre */}
      {showRemoveMemberConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-4 text-apricot-500 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-semibold">Retirer ce membre ?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Le membre sera retiré du groupe et n'aura plus accès aux discussions et événements.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveMemberConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (showRemoveMemberConfirm) {
                    onRemoveMember(showRemoveMemberConfirm);
                    setShowRemoveMemberConfirm(null);
                  }
                }}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}