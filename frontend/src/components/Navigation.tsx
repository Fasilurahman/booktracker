import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:cursor-pointer">
            <BookOpen size={24} />
            <span className="text-xl font-semibold">BookTracker</span>
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/books"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Books
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};