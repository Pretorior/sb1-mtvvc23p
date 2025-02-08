import React, { useState } from 'react';
import { UserPlus, UserMinus, Bell, BellOff } from 'lucide-react';

interface UserFollowButtonProps {
  userId: string;
  isFollowing: boolean;
  hasNotifications: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onToggleNotifications: (userId: string) => void;
}

export function UserFollowButton({
  userId,
  isFollowing,
  hasNotifications,
  onFollow,
  onUnfollow,
  onToggleNotifications
}: UserFollowButtonProps) {
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {isFollowing ? (
        <>
          <button
            onClick={() => setShowUnfollowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <UserMinus className="w-5 h-5" />
            Suivi
          </button>
          <button
            onClick={() => onToggleNotifications(userId)}
            className={`p-2 rounded-full transition-colors ${
              hasNotifications
                ? 'bg-malibu-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {hasNotifications ? (
              <Bell className="w-5 h-5" />
            ) : (
              <BellOff className="w-5 h-5" />
            )}
          </button>
        </>
      ) : (
        <button
          onClick={() => onFollow(userId)}
          className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Suivre
        </button>
      )}

      {/* Modal de confirmation pour ne plus suivre */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ne plus suivre cet utilisateur ?
            </h3>
            <p className="text-gray-600 mb-6">
              Vous ne verrez plus ses activités dans votre fil d'actualité.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUnfollowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onUnfollow(userId);
                  setShowUnfollowConfirm(false);
                }}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Ne plus suivre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}