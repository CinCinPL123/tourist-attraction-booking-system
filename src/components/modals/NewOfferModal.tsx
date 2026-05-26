'use client';

import React from 'react';
import { X, Send, Baby } from 'lucide-react';
import { Category } from '@/types';
import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), { ssr: false });

interface NewOfferModalProps {
  showNewOfferModal: boolean;
  onClose: () => void;
  newOfferTitle: string;
  setNewOfferTitle: (title: string) => void;
  newOfferCategory: string;
  setNewOfferCategory: (category: string) => void;
  categories: Category[];
  newOfferPrice: number;
  setNewOfferPrice: (price: number) => void;
  newOfferKidFriendly: boolean;
  setNewOfferKidFriendly: (kidFriendly: boolean) => void;
  newOfferDesc: string;
  setNewOfferDesc: (desc: string) => void;
  newOfferLat: number;
  setNewOfferLat: (lat: number) => void;
  newOfferLng: number;
  setNewOfferLng: (lng: number) => void;
  newOfferFileName: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateOffer: () => void;
}

export default function NewOfferModal({
  showNewOfferModal,
  onClose,
  newOfferTitle,
  setNewOfferTitle,
  newOfferCategory,
  setNewOfferCategory,
  categories,
  newOfferPrice,
  setNewOfferPrice,
  newOfferKidFriendly,
  setNewOfferKidFriendly,
  newOfferDesc,
  setNewOfferDesc,
  newOfferLat,
  setNewOfferLat,
  newOfferLng,
  setNewOfferLng,
  newOfferFileName,
  handleImageUpload,
  handleCreateOffer
}: NewOfferModalProps) {
  if (!showNewOfferModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-950 text-base">New Offer Form</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Attraction name</label>
            <input
              type="text"
              value={newOfferTitle}
              onChange={(e) => setNewOfferTitle(e.target.value)}
              placeholder="Enter attraction name"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Category</label>
            <select
              value={newOfferCategory}
              onChange={(e) => setNewOfferCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Base price (PLN)</label>
              <input
                type="number"
                value={newOfferPrice}
                onChange={(e) => setNewOfferPrice(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newOfferKidFriendly}
                  onChange={(e) => setNewOfferKidFriendly(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <span className="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                  Kid-friendly <Baby className="w-3.5 h-3.5 text-brand-600" />
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Attraction description</label>
            <textarea
              value={newOfferDesc}
              onChange={(e) => setNewOfferDesc(e.target.value)}
              rows={3}
              placeholder="Add an engaging description..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            />
          </div>

          {/* Location Picker Map */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 block mb-1">
              Select location on the map
            </label>
            <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-xs relative bg-slate-100">
              <LocationPickerMap
                lat={newOfferLat}
                lng={newOfferLng}
                onChange={(lat, lng) => {
                  setNewOfferLat(lat);
                  setNewOfferLng(lng);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={newOfferLat}
                  onChange={(e) => setNewOfferLat(parseFloat(e.target.value) || 0)}
                  className="w-full text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={newOfferLng}
                  onChange={(e) => setNewOfferLng(parseFloat(e.target.value) || 0)}
                  className="w-full text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1.5">Attraction photo (file)</label>
            <label className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors border-dashed hover:border-brand-500">
              <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                {newOfferFileName || "Nie wybrano pliku"}
              </span>
              <span className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg transition-colors shrink-0">
                Przeglądaj
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateOffer}
            className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Submit for verification <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
