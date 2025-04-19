import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library, PenSquare, Star, Users, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen size={40} className="text-blue-600" />
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
              BookTracker
            </h1>
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your personal library companion. Transform your reading journey with our elegant tracking system.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Sparkles size={20} />
              Get Started
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-all transform hover:-translate-y-1">
            <div className="text-blue-600 mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
              <Library size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Track Books</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Organize your reading list effortlessly. Keep track of your entire library in one beautiful interface.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-all transform hover:-translate-y-1">
            <div className="text-indigo-600 mb-6 bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center">
              <Star size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Reading Progress</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Monitor your reading journey with intuitive progress tracking and beautiful visualizations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-all transform hover:-translate-y-1">
            <div className="text-blue-600 mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
              <PenSquare size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Take Notes</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Capture your thoughts and insights as you read. Build your personal knowledge library.
            </p>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto bg-white rounded-2xl p-12 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Join Our Reading Community</h2>
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50k+</div>
              <div className="text-gray-600">Books Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100k+</div>
              <div className="text-gray-600">Notes Created</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Users size={24} className="text-blue-600" />
            <p className="text-lg text-gray-600">
              Join thousands of readers who have already transformed their reading experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};