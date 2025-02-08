import React from 'react';
import { Shield, Users, Settings, AlertTriangle, MessageSquare, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModeratorMenuProps {
  groupId: string;
  onOpenMemberManager: () => void;
  onOpenReportedContent: () => void;
}

export function ModeratorMenu({ groupId, onOpenMemberManager, onOpenReportedContent }: ModeratorMenuProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-malibu-500" />
        Menu de modération
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to={`/community/group/${groupId}/settings`}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">Paramètres du groupe</p>
            <p className="text-sm text-gray-500">Modifier les informations et règles</p>
          </div>
        </Link>

        <button
          onClick={onOpenMemberManager}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Users className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">Gestion des membres</p>
            <p className="text-sm text-gray-500">Gérer les rôles et accès</p>
          </div>
        </button>

        <button
          onClick={onOpenReportedContent}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">Contenu signalé</p>
            <p className="text-sm text-gray-500">Examiner les signalements</p>
          </div>
        </button>

        <Link
          to={`/community/group/${groupId}/discussions`}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">Modération des discussions</p>
            <p className="text-sm text-gray-500">Gérer les discussions et commentaires</p>
          </div>
        </Link>
      </div>
    </div>
  );
}