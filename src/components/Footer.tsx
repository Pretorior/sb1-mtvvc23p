import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center space-x-6 md:space-x-12">
          {['À propos', 'CGU', 'Confidentialité', 'Contact', 'Aide'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              {item}
            </a>
          ))}
        </nav>
        <p className="mt-8 text-center text-sm text-gray-400">
          &copy; 2024 BiblioSphere. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}