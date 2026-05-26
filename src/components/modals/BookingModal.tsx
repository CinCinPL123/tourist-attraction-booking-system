'use client';

import { X, ShoppingCart, ChevronRight } from 'lucide-react';
import { Attraction } from '@/types';

interface BookingModalProps {
  selectedAttractionForBooking: Attraction | null;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  bookingTicketsCount: number;
  setBookingTicketsCount: (count: number | ((prev: number) => number)) => void;
  checkDateAvailability: (date: string) => boolean;
  handleBooking: () => void;
  onClose: () => void;
}

export default function BookingModal({
  selectedAttractionForBooking,
  bookingDate,
  setBookingDate,
  bookingTicketsCount,
  setBookingTicketsCount,
  checkDateAvailability,
  handleBooking,
  onClose
}: BookingModalProps) {
  if (!selectedAttractionForBooking) return null;

  const isAvailable = checkDateAvailability(bookingDate);
  const totalPrice = selectedAttractionForBooking.price * bookingTicketsCount;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl scale-100 transition-all duration-300">
        <div className="h-44 w-full relative bg-slate-200">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${selectedAttractionForBooking.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-brand-600 rounded-md">
              {selectedAttractionForBooking.category}
            </span>
            <h3 className="text-xl font-black mt-1">{selectedAttractionForBooking.title}</h3>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Description</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {selectedAttractionForBooking.desc}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-slate-700" /> Booking Configurator
            </h4>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 block">Select visit date</label>
              <input
                type="date"
                min="2026-06-01"
                max="2027-12-31"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <div className="mt-1 flex items-center">
                {isAvailable ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Date available
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Date blocked (unavailable)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Number of tickets</span>
                <span className="text-xs font-bold text-slate-700">Price: {selectedAttractionForBooking.price} PLN/person</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBookingTicketsCount(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-bold w-6 text-center">{bookingTicketsCount}</span>
                <button
                  onClick={() => setBookingTicketsCount(prev => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900">Total price:</span>
              <span className="text-lg font-black text-brand-700">
                {totalPrice} PLN
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!isAvailable}
              className={`flex-1 py-3 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                isAvailable
                  ? 'bg-brand-600 hover:bg-brand-700'
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              Book Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
