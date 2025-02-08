import React from 'react';
import { BookOpen, Heart, MessageSquare, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'reading',
      user: {
        id: '2',
        name: 'Marie',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      action: 'a commencé la lecture de',
      target: {
        id: '1',
        title: 'L\'Étranger'
      },
      time: 'Il y a 2h',
      icon: BookOpen,
      iconColor: 'text-malibu-400 bg-malibu-50',
    },
    {
      id: 2,
      type: 'like',
      user: {
        id: '3',
        name: 'Thomas',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
      },
      action: 'a aimé votre avis sur',
      target: {
        id: '2',
        title: 'Le Petit Prince'
      },
      time: 'Il y a 3h',
      icon: Heart,
      iconColor: 'text-apricot-400 bg-apricot-50',
    },
    {
      id: 3,
      type: 'comment',
      user: {
        id: '4',
        name: 'Sophie',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
      },
      action: 'a commenté dans le club de lecture',
      target: {
        id: '1',
        title: 'Les Classiques Français'
      },
      time: 'Il y a 5h',
      icon: MessageSquare,
      iconColor: 'text-malibu-400 bg-malibu-50',
    },
    {
      id: 4,
      type: 'sale',
      user: {
        id: '5',
        name: 'Lucas',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      },
      action: 'vend',
      target: {
        id: '3',
        title: 'Madame Bovary'
      },
      time: 'Il y a 6h',
      icon: ShoppingBag,
      iconColor: 'text-feijoa-400 bg-feijoa-50',
    },
  ];

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-100"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-4">
                <div className={`relative p-2 rounded-full ${activity.iconColor}`}>
                  <activity.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 bg-white rounded-2xl p-4 hover:shadow-md transition-shadow">
                  <div>
                    <div className="text-sm">
                      <Link 
                        to={`/profile/${activity.user.id}`}
                        className="font-medium text-gray-900 hover:text-malibu-500 transition-colors"
                      >
                        {activity.user.name}
                      </Link>{' '}
                      <span className="text-gray-500">{activity.action}</span>{' '}
                      <Link 
                        to={`/book/${activity.target.id}`}
                        className="font-medium text-gray-900 hover:text-malibu-500 transition-colors"
                      >
                        {activity.target.title}
                      </Link>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}