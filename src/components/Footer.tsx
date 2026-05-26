'use client';

import { Info, BookOpen, Shield, Mail, RefreshCw } from 'lucide-react';

interface FooterProps {
  loadCmsPage: (slug: string) => void;
  handleDbReset: () => void;
}

export default function Footer({ loadCmsPage, handleDbReset }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © 2026 Tourist Attraction Booking System Inc. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-4 font-medium">
          <button onClick={() => loadCmsPage('o-nas')} className="hover:underline flex items-center gap-1 cursor-pointer">
            <Info className="w-3.5 h-3.5" /> About us
          </button>
          <button onClick={() => loadCmsPage('regulamin')} className="hover:underline flex items-center gap-1 cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" /> Terms of Service
          </button>
          <button onClick={() => loadCmsPage('polityka-prywatnosci')} className="hover:underline flex items-center gap-1 cursor-pointer">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </button>
          <button onClick={() => loadCmsPage('kontakt')} className="hover:underline flex items-center gap-1 cursor-pointer">
            <Mail className="w-3.5 h-3.5" /> Contact
          </button>
          <button
            onClick={handleDbReset}
            className="hover:underline flex items-center gap-1.5 cursor-pointer text-red-600 font-extrabold"
            title="Reset Database to Defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Database
          </button>
        </div>
      </div>
    </footer>
  );
}
