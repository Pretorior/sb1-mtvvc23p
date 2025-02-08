import React from 'react';
import { User } from '../types';
import { BookOpen, TrendingUp } from 'lucide-react';

interface SideStatsProps {
  user: User;
}

export function SideStats({ user }: SideStatsProps) {
  const stats = [
    {
      name: 'Livres lus',
      value: user.readingStats.booksRead,
      icon: BookOpen,
      change: '+2.1%',
      changeType: 'increase',
      color: 'bg-malibu-400',
    },
    {
      name: 'Pages lues',
      value: user.readingStats.pagesRead,
      icon: TrendingUp,
      change: '+4.3%',
      changeType: 'increase',
      color: 'bg-feijoa-400',
    },
  ];

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">Statistiques</h3>
        <dl className="mt-6 grid grid-cols-1 gap-6">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative bg-white rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <dt>
                <div className={`absolute rounded-xl ${item.color} p-3`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-medium ${
                    item.changeType === 'increase'
                      ? 'text-feijoa-500'
                      : 'text-apricot-500'
                  }`}
                >
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}