'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Baby,
  Calendar,
  X,
  MapPin,
  Ticket,
  Heart,
  Star,
  MessageSquare,
  ChevronRight,
  Flag
} from 'lucide-react';
import { Attraction, Booking, User, Category } from '@/types';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface TouristViewProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  kidFriendly: boolean;
  setKidFriendly: (kidFriendly: boolean) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  favoriteAttractions: Attraction[];
  bookings: Booking[];
  loggedInUser: User | null;
  filteredAttractions: Attraction[];
  openBookingModal: (attraction: Attraction) => void;
  optimizePlanner: () => void;
  activeReviewAttractionId: number | null;
  setActiveReviewAttractionId: (id: number | null) => void;
  newReviewRating: number;
  setNewReviewRating: (rating: number) => void;
  newReviewComment: string;
  setNewReviewComment: (comment: string) => void;
  handleCreateReview: (attractionId: number) => void;
  handleFlagReview: (reviewId: number) => void;
}

export default function TouristView({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  maxPrice,
  setMaxPrice,
  kidFriendly,
  setKidFriendly,
  favorites,
  toggleFavorite,
  favoriteAttractions,
  bookings,
  loggedInUser,
  filteredAttractions,
  openBookingModal,
  optimizePlanner,
  activeReviewAttractionId,
  setActiveReviewAttractionId,
  newReviewRating,
  setNewReviewRating,
  newReviewComment,
  setNewReviewComment,
  handleCreateReview,
  handleFlagReview
}: TouristViewProps) {
  return (
    <div className="fade-in space-y-6">
      
      {/* Banner & Search */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40"></circle>
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Find your adventure
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
            Discover unique attractions & plan your trip
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Book tickets, create your own travel plan and enjoy your trip without stress.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 bg-white p-3 rounded-2xl shadow-lg text-slate-800 flex flex-col md:flex-row gap-3 items-center relative z-10">
          <div className="w-full md:flex-1 flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl bg-slate-50">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name e.g. Castle, Museum..."
              className="bg-transparent text-sm w-full focus:outline-none text-slate-700 font-medium"
            />
          </div>

          <div className="w-full md:w-48 px-3 py-2 border border-slate-100 rounded-xl bg-slate-50 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setMaxPrice(150);
              setKidFriendly(false);
            }}
            className="w-full md:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset filters
          </button>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Filters and Travel Planner */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Advanced Criteria Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Filtering Criteria
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Maximum ticket price</span>
                <span className="text-brand-600 font-bold">{maxPrice} PLN</span>
              </div>
              <input
                type="range"
                min="30"
                max="400"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>30 PLN</span>
                <span>400 PLN</span>
              </div>
            </div>

            <label className="relative flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-brand-600" /> Only kid-friendly
                </span>
                <span className="text-[10px] text-slate-400">Attractions suitable for families</span>
              </div>
              <input
                type="checkbox"
                checked={kidFriendly}
                onChange={(e) => setKidFriendly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full relative transition-colors peer-checked:bg-brand-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
            </label>
          </div>

          {/* Planner & Favorites */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">My Travel Planner</h3>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Plan your perfect trip. Add attractions by clicking the heart icon on the card.
            </p>

            <div className="space-y-3">
              {favoriteAttractions.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-400">No attractions added</p>
                  <p className="text-[10px] text-slate-400 mt-1">Click the heart icon on the attraction card</p>
                </div>
              ) : (
                favoriteAttractions.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${att.image})` }} />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{att.title}</h4>
                        <span className="text-[9px] text-slate-400">{att.category} • {att.price} PLN</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(att.id)}
                      className="p-1 text-rose-500 hover:bg-slate-100 rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {favoriteAttractions.length > 0 && (
              <button
                onClick={optimizePlanner}
                className="w-full py-2.5 bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MapPin className="w-4 h-4" /> Generate optimal route
              </button>
            )}
          </div>

          {/* My Bookings (Tickets purchased) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">My Bookings</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {bookings.filter(b => b.userId === loggedInUser?.id).length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-400">No active bookings</p>
                  <p className="text-[10px] text-slate-400 mt-1">Book tickets on an attraction card</p>
                </div>
              ) : (
                bookings.filter(b => b.userId === loggedInUser?.id).map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span className="truncate">{b.attraction?.title || 'Attraction'}</span>
                      <span className="text-emerald-700 shrink-0">{b.totalPrice} PLN</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Date: {b.date}</span>
                      <span>Tickets: {b.ticketsCount}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200/50 flex justify-between items-center">
                      <span className="text-[9px] text-slate-400 font-medium">Status:</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        b.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Map and Listings Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Suggested Attractions (<span id="results-count">{filteredAttractions.length}</span>)
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Interactive map synced with the list
            </div>
          </div>

          {/* Leaflet Map Component wrapper */}
          <div className="bg-slate-100 rounded-3xl border border-slate-200/80 h-80 overflow-hidden relative shadow-md z-10">
            <Map attractions={filteredAttractions} onSelectAttraction={openBookingModal} />
          </div>

          {/* Grid list of filtered attractions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAttractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${attraction.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(attraction.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-md text-slate-600 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.includes(attraction.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="text-[10px] font-bold text-white bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {attraction.category}
                    </span>
                    {attraction.kidFriendly && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <Baby className="w-2.5 h-2.5" /> Kid-friendly
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-brand-600 transition-colors">
                        {attraction.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-slate-800">{attraction.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Provider: {attraction.providerName}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {attraction.desc}
                    </p>
                  </div>

                  {/* Reviews list inline preview */}
                  {attraction.reviews && attraction.reviews.filter(r => !r.isFlagged).length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Customer Reviews:
                      </span>
                      {attraction.reviews.filter(r => !r.isFlagged).slice(0, 2).map((rev) => (
                        <div key={rev.id} className="text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>{rev.author}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="flex text-amber-500">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                ))}
                              </div>
                              <button
                                onClick={() => handleFlagReview(rev.id)}
                                title="Report review"
                                className="p-0.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Flag className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-500 mt-0.5 italic">"{rev.comment}"</p>
                          {rev.reply && (
                            <div className="mt-1 pl-2 border-l-2 border-emerald-500 text-[10px] text-emerald-800">
                              <span className="font-bold">Organizer's response:</span> {rev.reply}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Write review form (available for all logged in users, except providers on their own attractions) */}
                  {loggedInUser && (
                    loggedInUser.role !== 'provider' ||
                    (loggedInUser.companyName !== attraction.providerName && loggedInUser.name !== attraction.providerName)
                  ) && (
                    <div className="pt-2 border-t border-slate-100">
                      {activeReviewAttractionId === attraction.id ? (
                        <div className="space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/50 fade-in">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Your Rating:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setNewReviewRating(star)}
                                  className="focus:outline-none cursor-pointer"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= newReviewRating
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            placeholder="Write your review here..."
                            rows={2}
                            className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-1 focus:ring-brand-500 focus:outline-none"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReviewAttractionId(null);
                                setNewReviewComment('');
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCreateReview(attraction.id)}
                              className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Submit Review
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReviewAttractionId(attraction.id);
                            setNewReviewRating(5);
                            setNewReviewComment('');
                          }}
                          className="text-xs font-extrabold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all w-fit mt-1 border border-brand-200/30 shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Write a review
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Ticket price</span>
                      <span className="text-base font-black text-brand-700">{attraction.price} PLN</span>
                    </div>
                    <button
                      onClick={() => openBookingModal(attraction)}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Book tickets <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
