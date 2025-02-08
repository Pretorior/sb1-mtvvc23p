import React, { useState } from 'react';
import { 
  Bell, Lock, User, CreditCard, Globe, Settings as SettingsIcon, 
  Moon, Sun, BookOpen, Users, Eye, EyeOff, Palette, Languages,
  BellRing, BellOff, Smartphone, Mail, Shield, CreditCardIcon,
  Receipt, History, Trash2, Download, LogOut
} from 'lucide-react';
import { LogoutButton } from '../components/LogoutButton';

interface SettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    subscription?: {
      plan: 'free' | 'premium' | 'pro';
      validUntil: Date;
      autoRenew: boolean;
    };
    preferences: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      notifications: {
        email: boolean;
        push: boolean;
        readingReminders: boolean;
        groupActivity: boolean;
        friendActivity: boolean;
        marketing: boolean;
      };
      privacy: {
        profileVisibility: 'public' | 'friends' | 'private';
        readingActivity: 'public' | 'friends' | 'private';
        libraryVisibility: 'public' | 'friends' | 'private';
        showOnlineStatus: boolean;
      };
    };
  };
  onUpdatePrivacy: (settings: any) => void;
}

export function Settings({ user, onUpdatePrivacy }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'privacy' | 'notifications' | 'subscription' | 
    'security' | 'appearance' | 'app' | 'data'
  >('profile');

  const [preferences, setPreferences] = useState(user.preferences);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSavePreferences = () => {
    // Save preferences to backend
    console.log('Saving preferences:', preferences);
  };

  const handleDeleteAccount = () => {
    // Delete account logic
    console.log('Deleting account...');
  };

  const handleExportData = () => {
    // Export user data logic
    console.log('Exporting user data...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              {[
                { key: 'profile', label: 'Profil', icon: User },
                { key: 'privacy', label: 'Confidentialité', icon: Lock },
                { key: 'notifications', label: 'Notifications', icon: Bell },
                { key: 'subscription', label: 'Abonnement', icon: CreditCard },
                { key: 'security', label: 'Sécurité', icon: Shield },
                { key: 'appearance', label: 'Apparence', icon: Palette },
                { key: 'app', label: 'Application', icon: Smartphone },
                { key: 'data', label: 'Données', icon: Download }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === key
                      ? 'bg-malibu-50 text-malibu-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
                  
                  <div className="flex items-center gap-6">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full"
                    />
                    <button className="px-4 py-2 text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors">
                      Changer l'avatar
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bouton de déconnexion */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <LogoutButton />
                  </div>
                </div>
              )}

              {/* Save button */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer votre compte ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}