import React, { useState } from 'react';
import { Bell, Clock, Calendar, BookOpen, Settings, Trophy } from 'lucide-react';

interface ReadingNotification {
  id: string;
  type: 'reminder' | 'achievement' | 'goal' | 'recommendation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface ReadingNotificationsProps {
  notifications: ReadingNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export function ReadingNotifications({
  notifications,
  onMarkAsRead,
  onClearAll
}: ReadingNotificationsProps) {
  const [showAll, setShowAll] = useState(false);

  const getNotificationIcon = (type: ReadingNotification['type']) => {
    switch (type) {
      case 'reminder':
        return Clock;
      case 'achievement':
        return Trophy;
      case 'goal':
        return Target;
      case 'recommendation':
        return BookOpen;
      default:
        return Bell;
    }
  };

  const displayedNotifications = showAll 
    ? notifications 
    : notifications.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayedNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                notification.read ? 'bg-gray-50' : 'bg-malibu-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                notification.read ? 'bg-gray-100' : 'bg-malibu-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  notification.read ? 'text-gray-500' : 'text-malibu-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${
                      notification.read ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm ${
                      notification.read ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                {notification.actionUrl && (
                  <Link
                    to={notification.actionUrl}
                    className="inline-block mt-2 text-sm text-malibu-500 hover:text-malibu-600"
                  >
                    Voir les détails
                  </Link>
                )}
              </div>

              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {notifications.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-sm text-malibu-500 hover:text-malibu-600"
          >
            {showAll ? 'Voir moins' : 'Voir plus'}
          </button>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  );
}