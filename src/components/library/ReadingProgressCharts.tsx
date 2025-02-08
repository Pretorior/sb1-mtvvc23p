import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useReadingStats } from '../../hooks/useReadingStats';

interface ReadingProgressChartsProps {
  period: 'daily' | 'weekly' | 'monthly';
}

export function ReadingProgressCharts({ period }: ReadingProgressChartsProps) {
  const { stats, loading, error } = useReadingStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">
          <div className="p-2 bg-gradient-to-br from-malibu-400 to-malibu-500 rounded-xl shadow-sm">
            <div className="w-12 h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const data = stats[period];

  const formatXAxis = (value: string) => {
    switch (period) {
      case 'daily':
        return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      case 'weekly':
        return `S${value.split('-W')[1]}`;
      case 'monthly':
        return new Date(value + '-01').toLocaleDateString('fr-FR', { month: 'short' });
      default:
        return value;
    }
  };

  return (
    <div className="space-y-8">
      {/* Graphique des pages lues */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pages lues</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'date'}
                tickFormatter={formatXAxis}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value} pages`, 'Pages lues']}
                labelFormatter={formatXAxis}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pages"
                stroke="#4D9CEF"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Pages lues"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique du temps de lecture */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Temps de lecture</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'date'}
                tickFormatter={formatXAxis}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => {
                  const hours = Math.floor(value / 60);
                  const minutes = value % 60;
                  return [`${hours}h${minutes.toString().padStart(2, '0')}`, 'Temps de lecture'];
                }}
                labelFormatter={formatXAxis}
              />
              <Legend />
              <Bar
                dataKey="time"
                fill="#58BF34"
                name="Temps de lecture"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques de série */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Série actuelle</p>
            <p className="text-3xl font-bold text-gray-900">{stats.streak.currentStreak}</p>
            <p className="text-sm text-gray-500">jours</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Plus longue série</p>
            <p className="text-3xl font-bold text-gray-900">{stats.streak.longestStreak}</p>
            <p className="text-sm text-gray-500">jours</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Dernière lecture</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Date(stats.streak.lastReadDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}