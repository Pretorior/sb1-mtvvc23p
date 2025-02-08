import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Library, Users, ShoppingBag, Bell, MessageSquare, Settings } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo et nom */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="p-2 bg-gradient-to-br from-malibu-400 to-malibu-500 rounded-xl shadow-sm group-hover:shadow transition-shadow">
                <Library className="w-8 h-8 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-malibu-400 to-malibu-500 bg-clip-text text-transparent">
                BiblioSphere
              </h1>
            </Link>
          </div>

          {/* Navigation principale */}
          <nav className="hidden md:flex space-x-2">
            {[
              { key: 'home', label: 'Accueil', icon: null, path: '/' },
              { key: 'library', label: 'Bibliothèque', icon: Library, path: '/library' },
              { key: 'community', label: 'Communauté', icon: Users, path: '/community' },
              { key: 'marketplace', label: 'Marché local', icon: ShoppingBag, path: '/marketplace' },
            ].map(({ key, label, icon: Icon, path }) => (
              <Link
                key={key}
                to={path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  currentPath === path
                    ? 'text-white bg-gradient-to-r from-malibu-400 to-malibu-500 shadow-sm'
                    : 'text-gray-600 hover:text-malibu-500 hover:bg-malibu-50'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 mr-2" />}
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-2">
            {/* Messages */}
            <Link 
              to="/messages" 
              className={`relative p-2 rounded-full transition-all duration-200 ${
                currentPath === '/messages' 
                  ? 'text-white bg-gradient-to-r from-malibu-400 to-malibu-500 shadow-sm'
                  : 'text-gray-400 hover:text-malibu-500 hover:bg-malibu-50'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-apricot-400 rounded-full ring-2 ring-white" />
            </Link>

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-400 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-all duration-200"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-feijoa-400 rounded-full ring-2 ring-white" />
            </button>

            {/* Menu utilisateur */}
            <div className="relative group">
              <button className="flex items-center p-1.5 rounded-full hover:bg-malibu-50 transition-all duration-200">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full ring-2 ring-malibu-100 group-hover:ring-malibu-200 transition-colors"
                />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-malibu-500 hover:bg-malibu-50 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-malibu-500 hover:bg-malibu-50 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir mon profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}