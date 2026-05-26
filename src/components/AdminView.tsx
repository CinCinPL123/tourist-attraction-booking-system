'use client';

import React from 'react';
import { ShieldCheck, ClipboardCheck, Baby, Flag, Tags, Plus, X } from 'lucide-react';
import { Attraction, Review, Category } from '@/types';

interface AdminViewProps {
  pendingAttractions: Attraction[];
  handleDeclineAttraction: (id: number) => void;
  handleApproveAttraction: (id: number) => void;
  flaggedReviews: Review[];
  handleApproveReview: (id: number) => void;
  handleDeleteReview: (id: number) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  handleAddCategory: () => void;
  handleDeleteCategory: (id: number) => void;
  categories: Category[];
}

export default function AdminView({
  pendingAttractions,
  handleDeclineAttraction,
  handleApproveAttraction,
  flaggedReviews,
  handleApproveReview,
  handleDeleteReview,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  handleDeleteCategory,
  categories
}: AdminViewProps) {
  return (
    <div className="fade-in space-y-6">
      
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-brand-600" /> Main Administrator Panel
        </h1>
        <p className="text-slate-500 text-sm">
          Verify listings, moderate reported contents, and oversee platform metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Verification Queue */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-600" /> Listing Verification Queue
              </h3>
              <p className="text-xs text-slate-400">
                Approve provider submissions before publishing.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingAttractions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No listings pending verification.
              </div>
            ) : (
              pendingAttractions.map((att) => (
                <div key={att.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{att.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        Category: <span className="font-bold text-slate-500">{att.category}</span> | Provider: <span className="font-bold text-slate-500">{att.providerName}</span>
                      </span>
                    </div>
                    <span className="text-sm font-black text-emerald-700">{att.price} PLN</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{att.desc}</p>
                  
                  {att.kidFriendly && (
                    <span className="inline-flex text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md items-center gap-0.5">
                      <Baby className="w-2.5 h-2.5" /> Kid-friendly
                    </span>
                  )}

                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleDeclineAttraction(att.id)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleApproveAttraction(att.id)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Approve & publish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Moderation & Categories */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Moderation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                <Flag className="w-5 h-5 text-rose-500" /> Moderation Reports
              </h3>
              <p className="text-xs text-slate-400">
                Remove reviews reported for violating terms.
              </p>
            </div>

            <div className="space-y-3">
              {flaggedReviews.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No moderation reports.
                </div>
              ) : (
                flaggedReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-lg border border-red-100 bg-red-50/30 space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-bold text-slate-700">Author: {rev.author}</span>
                      <span className="text-[9px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                        Reported
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => handleApproveReview(rev.id)}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded"
                      >
                        Dismiss report
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded"
                      >
                        Delete comment
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                <Tags className="w-5 h-5 text-slate-700" /> Category Creator
              </h3>
              <p className="text-xs text-slate-400">
                Add new attraction types in real-time.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Eco-tourism"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-500 focus:outline-none bg-white"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 group transition-all duration-200"
                >
                  <span>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    title={`Delete category ${cat.name}`}
                    className="p-0.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer focus:outline-none"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
