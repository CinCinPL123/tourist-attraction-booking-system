'use client';

import { Info, X } from 'lucide-react';
import { CmsPage } from '@/types';

interface CmsModalProps {
  selectedCmsPage: CmsPage | null;
  onClose: () => void;
}

export default function CmsModal({ selectedCmsPage, onClose }: CmsModalProps) {
  if (!selectedCmsPage) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
            <Info className="w-5 h-5 text-brand-600" /> {selectedCmsPage.title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="prose prose-slate max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {selectedCmsPage.content}
          </p>
        </div>
        
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
