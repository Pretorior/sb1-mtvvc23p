import React, { useState } from 'react';
import { Bell, BellOff, Lock, Users, Trash2, LogOut, X, Image, Settings as SettingsIcon } from 'lucide-react';
import { Chat, User } from '../../types';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  currentUser: User;
  onUpdateSettings: (settings: Partial<Chat['settings']>) => void;
  onAddParticipants: () => void;
  onRemoveParticipant: (userId: string) => void;
  onLeaveGroup: () => void;
  onDeleteChat: () => void;
}

export function ChatSettings({
  isOpen,
  onClose,
  chat,
  currentUser,
  onUpdateSettings,
  onAddParticipants,
  onRemoveParticipant,
  onLeaveGroup,
  onDeleteChat
}: ChatSettingsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [muteUntil, setMuteUntil] = useState<string | null>(null);

  const isAdmin = chat.type === 'group' && 
    chat.groupInfo?.members.find(m => m.userId === currentUser.id)?.role === 'admin';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Paramètres</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="flex items-center gap-4">
            {chat.type === 'group' ? (
              <>
                {chat.groupInfo?.avatar ? (
                  <img
                    src={chat.groupInfo.avatar}
                    alt={chat.groupInfo.name}
                    className="w-20 h-20 rounded-xl"
                  />
                ) : (
                  <div className="w-20 h-20 bg-malibu-100 rounded-xl flex items-center justify-center">
                    <Users className="w-10 h-10 text-malibu-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{chat.groupInfo?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {chat.participants.length} participants
                  </p>
                  {isAdmin && (
                    <button className="mt-2 text-sm text-malibu-500 hover:text-malibu-600">
                      Modifier
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <img
                  src={chat.participants.find(p => p.id !== currentUser.id)?.avatar}
                  alt={chat.participants.find(p => p.id !== currentUser.id)?.name}
                  className="w-20 h-20 rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {chat.participants.find(p => p.id !== currentUser.id)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">En ligne</p>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Notifications</h4>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {chat.settings?.notifications ? (
                  <Bell className="w-5 h-5 text-gray-400" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-gray-700">
                  {chat.settings?.notifications ? 'Notifications activées' : 'Notifications désactivées'}
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ notifications: !chat.settings?.notifications })}
                className="px-3 py-1 text-sm text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
              >
                Modifier
              </button>
            </div>
            {chat.settings?.notifications && (
              <div className="pl-4">
                <select
                  value={muteUntil || ''}
                  onChange={(e) => {
                    setMuteUntil(e.target.value || null);
                    onUpdateSettings({ muteUntil: e.target.value || undefined });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                >
                  <option value="">Ne pas mettre en sourdine</option>
                  <option value="1h">1 heure</option>
                  <option value="8h">8 heures</option>
                  <option value="24h">24 heures</option>
                  <option value="7d">7 jours</option>
                  <option value="always">Toujours</option>
                </select>
              </div>
            )}
          </div>

          {/* Participants (pour les groupes) */}
          {chat.type === 'group' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Participants</h4>
                {isAdmin && (
                  <button
                    onClick={onAddParticipants}
                    className="text-sm text-malibu-500 hover:text-malibu-600"
                  >
                    Ajouter
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {chat.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {participant.name}
                          {participant.id === currentUser.id && ' (Vous)'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {chat.groupInfo?.members.find(m => m.userId === participant.id)?.role}
                        </p>
                      </div>
                    </div>
                    {isAdmin && participant.id !== currentUser.id && (
                      <button
                        onClick={() => onRemoveParticipant(participant.id)}
                        className="p-2 text-gray-400 hover:text-apricot-500 rounded-full hover:bg-apricot-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            {chat.type === 'group' ? (
              <>
                {isAdmin ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 text-left text-apricot-500 hover:bg-apricot-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Supprimer le groupe
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="w-full px-4 py-2 text-left text-apricot-500 hover:bg-apricot-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Quitter le groupe
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-2 text-left text-apricot-500 hover:bg-apricot-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer la conversation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {chat.type === 'group' ? 'Supprimer le groupe ?' : 'Supprimer la conversation ?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {chat.type === 'group'
                ? 'Cette action est irréversible. Tous les messages seront supprimés pour tous les participants.'
                : 'Cette action est irréversible. Tous les messages seront supprimés.'}
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
                  onDeleteChat();
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

      {/* Modal de confirmation pour quitter le groupe */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quitter le groupe ?
            </h3>
            <p className="text-gray-600 mb-6">
              Vous ne recevrez plus de messages de ce groupe. Vous pourrez toujours être réinvité plus tard.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onLeaveGroup();
                  setShowLeaveConfirm(false);
                }}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}