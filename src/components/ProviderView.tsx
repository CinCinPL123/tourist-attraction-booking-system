'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  TrendingUp,
  Ticket,
  Clock,
  Star,
  Eye,
  CalendarDays,
  Send,
  Sparkles,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Attraction, Booking, Review, User as UserType } from '@/types';

interface ProviderViewProps {
  setShowNewOfferModal: (show: boolean) => void;
  providerStats: {
    revenue: number;
    bookingsCount: number;
    rating: string;
    views: number;
  };
  blockedDates: string[];
  toggleCalendarDate: (dateStr: string) => void;
  bulkToggleCalendarDates: (dates: string[], action: 'block' | 'unblock') => void;
  bookings: Booking[];
  attractions: Attraction[];
  loggedInUser: UserType | null;
  handleUpdateBookingStatus: (bookingId: number, status: 'accepted' | 'declined') => void;
  reviews: Review[];
  reviewReplyTexts: { [key: number]: string };
  setReviewReplyTexts: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  handleReviewReply: (reviewId: number) => void;
  handleUpdateProfile: (payload: { name: string; companyName: string; taxNumber: string; phoneNumber: string; description: string }) => void;
}

export default function ProviderView({
  setShowNewOfferModal,
  providerStats,
  blockedDates,
  toggleCalendarDate,
  bulkToggleCalendarDates,
  bookings,
  attractions,
  loggedInUser,
  handleUpdateBookingStatus,
  reviews,
  reviewReplyTexts,
  setReviewReplyTexts,
  handleReviewReply,
  handleUpdateProfile
}: ProviderViewProps) {
  const [profileName, setProfileName] = useState(loggedInUser?.name || '');
  const [profileCompany, setProfileCompany] = useState(loggedInUser?.companyName || '');
  const [profileTax, setProfileTax] = useState(loggedInUser?.taxNumber || '');
  const [profilePhone, setProfilePhone] = useState(loggedInUser?.phoneNumber || '');
  const [profileDesc, setProfileDesc] = useState(loggedInUser?.description || '');

  // Availability calendar month/year state (defaults to June 2026 for mock consistency)
  const [activeYear, setActiveYear] = useState(2026);
  const [activeMonth, setActiveMonth] = useState(5); // 0-indexed: 5 = June

  useEffect(() => {
    if (loggedInUser) {
      setProfileName(loggedInUser.name || '');
      setProfileCompany(loggedInUser.companyName || '');
      setProfileTax(loggedInUser.taxNumber || '');
      setProfilePhone(loggedInUser.phoneNumber || '');
      setProfileDesc(loggedInUser.description || '');
    }
  }, [loggedInUser]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setActiveMonth(prev => {
      if (prev === 0) {
        setActiveYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setActiveMonth(prev => {
      if (prev === 11) {
        setActiveYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Calendar calculations
  const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(activeYear, activeMonth, 1).getDay() + 6) % 7;

  // Automated block rules
  const handleBlockWeekends = () => {
    const weekendDates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(activeYear, activeMonth, day);
      const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const dateStr = `${activeYear}-${(activeMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        weekendDates.push(dateStr);
      }
    }
    bulkToggleCalendarDates(weekendDates, 'block');
  };

  const handleBlockAllDays = () => {
    const allDates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${activeYear}-${(activeMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      allDates.push(dateStr);
    }
    bulkToggleCalendarDates(allDates, 'block');
  };

  const handleClearAllBlocks = () => {
    const allDates: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${activeYear}-${(activeMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      allDates.push(dateStr);
    }
    bulkToggleCalendarDates(allDates, 'unblock');
  };
  return (
    <div className="fade-in space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Organizer Business Panel
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your listings, control bookings, and reply to customer reviews.
          </p>
        </div>
        <button
          onClick={() => setShowNewOfferModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add new offer
        </button>
      </div>

      {/* Dashboard Mini-Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{providerStats.revenue} PLN</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <span>+ 12.4%</span> <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active bookings</span>
            <Ticket className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{providerStats.bookingsCount} tickets</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <Clock className="w-3 h-3 inline mr-1" /> Requires confirmation: 0
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{providerStats.rating} / 5.0</div>
          <div className="text-[11px] text-slate-400">
            Based on all customer reviews
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Listing views</span>
            <Eye className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{providerStats.views}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <span>↑ 8.2%</span> <span className="text-slate-400 font-normal">Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Split calendar and reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calendar & Bookings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-600" /> Availability Calendar
                </h3>
                <p className="text-xs text-slate-400">
                  Block dates when the service is unavailable (e.g. guide holiday).
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-24 text-center">
                    {monthNames[activeMonth]} {activeYear}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">Click days to toggle</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Empty padding cells */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Day buttons */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNumber = idx + 1;
                  const dateStr = `${activeYear}-${(activeMonth + 1).toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;
                  const isBlocked = blockedDates.includes(dateStr);
                  return (
                    <button
                      key={dayNumber}
                      onClick={() => toggleCalendarDate(dateStr)}
                      className={`aspect-square rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-colors cursor-pointer ${
                        isBlocked
                          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{dayNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Automated Block Rules */}
            <div className="pt-3.5 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Automated Rules (Automatyczne reguły)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleBlockWeekends}
                  className="px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Block Weekends
                </button>
                <button
                  onClick={handleBlockAllDays}
                  className="px-2 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Block All
                </button>
                <button
                  onClick={handleClearAllBlocks}
                  className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Clear Month
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-sm"></span>
                <span>Available date</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-50 border border-red-300 rounded-sm"></span>
                <span className="text-red-700 font-medium">Blocked</span>
              </div>
            </div>
          </div>

          {/* Bookings & Reservations List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-600" /> Bookings & Reservations
                </h3>
                <p className="text-xs text-slate-400">
                  See who booked tickets for your attractions.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {bookings.filter(b => {
                const attraction = attractions.find(a => a.id === b.attractionId);
                return attraction && attraction.providerName === loggedInUser?.companyName;
              }).length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-400">No reservations received yet</p>
                </div>
              ) : (
                bookings.filter(b => {
                  const attraction = attractions.find(a => a.id === b.attractionId);
                  return attraction && attraction.providerName === loggedInUser?.companyName;
                }).map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span className="truncate">{attractions.find(a => a.id === b.attractionId)?.title || 'Attraction'}</span>
                      <span className="text-indigo-700 shrink-0">{b.totalPrice} PLN</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Date: {b.date}</span>
                      <span>Tickets: {b.ticketsCount}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200/50 flex justify-between items-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        b.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status || 'pending'}
                      </span>
                      
                      {(!b.status || b.status === 'pending') && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'declined')}
                            className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[9px] rounded-lg transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'accepted')}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] rounded-lg transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Organizer Profile Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" /> Organizer Profile Details
                </h3>
                <p className="text-xs text-slate-400">
                  Update your contact details and business information.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Contact Person</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Contact Person Name"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="Company Name"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Tax Number (NIP)</label>
                <input
                  type="text"
                  value={profileTax}
                  onChange={(e) => setProfileTax(e.target.value)}
                  placeholder="Tax Number"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Business Description</label>
                <textarea
                  value={profileDesc}
                  onChange={(e) => setProfileDesc(e.target.value)}
                  placeholder="Description of activities..."
                  rows={3}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                />
              </div>

              <button
                onClick={() => handleUpdateProfile({
                  name: profileName,
                  companyName: profileCompany,
                  taxNumber: profileTax,
                  phoneNumber: profilePhone,
                  description: profileDesc
                })}
                className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Listings & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* My Attractions & Listings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" /> My Attractions & Listings
                </h3>
                <p className="text-xs text-slate-400">
                  View the status of your attraction offers on the platform.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {attractions.filter(a => a.providerName === loggedInUser?.companyName).length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No listings created yet. Click "Add new offer" to submit one.
                </div>
              ) : (
                attractions.filter(a => a.providerName === loggedInUser?.companyName).map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-slate-200" style={{ backgroundImage: `url(${a.image})` }} />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{a.title}</h4>
                        <span className="text-[10px] text-slate-400 block">{a.category} • {a.price} PLN</span>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase shrink-0 ${
                      a.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.isApproved ? 'Active' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reviews & Answers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-950 text-base tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" /> Reviews & Public Replies
                </h3>
                <p className="text-xs text-slate-400">
                  Build reputation. Reply directly to customer reviews.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.filter((rev) => {
                const attraction = attractions.find(a => a.id === rev.attractionId);
                return attraction && attraction.providerName === loggedInUser?.companyName;
              }).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No reviews received yet for your attractions.
                </div>
              ) : (
                reviews.filter((rev) => {
                  const attraction = attractions.find(a => a.id === rev.attractionId);
                  return attraction && attraction.providerName === loggedInUser?.companyName;
                }).map((rev) => {
                  const attraction = attractions.find(a => a.id === rev.attractionId)!;
                  return (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            To: {attraction.title}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs text-amber-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {rev.rating}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>

                      {rev.reply ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs text-emerald-800 space-y-1">
                          <span className="font-bold block">Your reply:</span>
                          <p>{rev.reply}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            value={reviewReplyTexts[rev.id] || ''}
                            onChange={(e) => setReviewReplyTexts(prev => ({ ...prev, [rev.id]: e.target.value }))}
                            placeholder="Type your reply..."
                            rows={2}
                            className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-500 focus:outline-none bg-white"
                          />
                          <button
                            onClick={() => handleReviewReply(rev.id)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3 h-3" /> Send reply
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
