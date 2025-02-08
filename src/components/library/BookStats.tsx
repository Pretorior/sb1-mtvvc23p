import React, { useState, useMemo } from 'react';
import { Book, TrendingUp, Award, Clock, Filter } from 'lucide-react';
import { Book as BookType } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

interface BookStatsProps {
  books: BookType[];
}

const COLORS = ['#4D9CEF', '#58BF34', '#EE8F56', '#9B59B6', '#F1C40F'];

export function BookStats({ books }: BookStatsProps) {
  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'speed' | 'rating'>('rating');

  // Calcul des statistiques de base
  const stats = useMemo(() => {
    const completed = books.filter(b => b.status === 'completed');
    return {
      totalBooks: books.length,
      completedBooks: completed.length,
      totalPages: books.reduce((acc, book) => acc + book.pageCount, 0),
      averageRating: completed
        .filter(b => b.rating)
        .reduce((acc, book) => acc + (book.rating || 0), 0) / completed.filter(b => b.rating).length || 0,
      readingTime: completed.reduce((acc, book) => {
        if (book.progress.startDate && book.progress.endDate) {
          return acc + (new Date(book.progress.endDate).getTime() - new Date(book.progress.startDate).getTime());
        }
        return acc;
      }, 0) / (1000 * 60 * 60), // Conversion en heures
      averagePagesPerDay: completed.reduce((acc, book) => {
        if (book.progress.startDate && book.progress.endDate) {
          const days = (new Date(book.progress.endDate).getTime() - new Date(book.progress.startDate).getTime()) / (1000 * 60 * 60 * 24);
          return acc + (book.pageCount / days);
        }
        return acc;
      }, 0) / completed.length || 0
    };
  }, [books]);

  // Données pour le graphique des genres
  const genreData = useMemo(() => {
    const genres: { [key: string]: number } = {};
    books.forEach(book => {
      book.genre.forEach(g => {
        genres[g] = (genres[g] || 0) + 1;
      });
    });
    return Object.entries(genres)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [books]);

  // Données pour le graphique d'évolution
  const readingTrends = useMemo(() => {
    const trends: { [key: string]: { books: number; pages: number } } = {};
    const completed = books.filter(b => b.status === 'completed' && b.progress.endDate);
    
    completed.forEach(book => {
      const date = new Date(book.progress.endDate!);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!trends[monthYear]) {
        trends[monthYear] = { books: 0, pages: 0 };
      }
      trends[monthYear].books += 1;
      trends[monthYear].pages += book.pageCount;
    });

    return Object.entries(trends)
      .map(([date, data]) => ({
        date,
        ...data
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [books]);

  // Classement des livres
  const bookRankings = useMemo(() => {
    return books
      .filter(book => book.status === 'completed' && book.progress.startDate && book.progress.endDate)
      .map(book => {
        const duration = Math.ceil(
          (new Date(book.progress.endDate!).getTime() - new Date(book.progress.startDate!).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const pagesPerDay = book.pageCount / duration;
        return {
          ...book,
          duration,
          pagesPerDay
        };
      })
      .sort((a, b) => sortBy === 'speed' ? b.pagesPerDay - a.pagesPerDay : (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }, [books, sortBy]);

  return (
    <div className="space-y-8">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-malibu-100 rounded-xl">
              <Book className="w-6 h-6 text-malibu-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Livres lus</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-feijoa-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-feijoa-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pages lues</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-apricot-100 rounded-xl">
              <Award className="w-6 h-6 text-apricot-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Note moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Temps de lecture</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(stats.readingTime)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            {[
              { value: '3months', label: '3 mois' },
              { value: '6months', label: '6 mois' },
              { value: '1year', label: '1 an' },
              { value: 'all', label: 'Tout' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value as typeof timeRange)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  timeRange === value
                    ? 'bg-malibu-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution par genre */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribution par genre</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution de la lecture */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution de la lecture</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="books"
                  stroke="#4D9CEF"
                  name="Livres"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pages"
                  stroke="#58BF34"
                  name="Pages"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques détaillées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-malibu-500" />
              <span className="font-medium text-gray-900">Moyenne de lecture</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(stats.averagePagesPerDay)} pages/jour
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-feijoa-500" />
              <span className="font-medium text-gray-900">Temps moyen par livre</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(stats.readingTime / stats.completedBooks)} heures
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Book className="w-5 h-5 text-apricot-500" />
              <span className="font-medium text-gray-900">Pages par livre</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(stats.totalPages / stats.completedBooks)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}