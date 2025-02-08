import React from 'react';
import { Shield, Info } from 'lucide-react';

interface VerificationBadgeProps {
  status: 'verified' | 'pending' | 'unverified';
  showTooltip?: boolean;
}

export function VerificationBadge({ status, showTooltip = true }: VerificationBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'bg-feijoa-500';
      case 'pending':
        return 'bg-malibu-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'Profil vérifié';
      case 'pending':
        return 'Vérification en cours';
      default:
        return 'Non vérifié';
    }
  };

  return (
    <div className="relative group">
      <div className={`flex items-center gap-1 px-3 py-1 ${getStatusColor()} text-white rounded-full`}>
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                {status === 'verified'
                  ? 'Ce profil a été vérifié par notre équipe. L\'identité de l\'utilisateur est confirmée.'
                  : status === 'pending'
                  ? 'La demande de vérification est en cours de traitement.'
                  : 'Ce profil n\'a pas encore été vérifié.'}
              </p>
            </div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}