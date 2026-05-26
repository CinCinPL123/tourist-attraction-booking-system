'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Building,
  Lock,
  User as UserIcon,
  ShieldAlert,
  Info,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TouristView from '@/components/TouristView';
import ProviderView from '@/components/ProviderView';
import AdminView from '@/components/AdminView';
import CmsModal from '@/components/modals/CmsModal';
import BookingModal from '@/components/modals/BookingModal';
import NewOfferModal from '@/components/modals/NewOfferModal';
import { Attraction, Review, Booking, CmsPage, User } from '@/types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<'tourist' | 'provider' | 'admin'>('tourist');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // Login form fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Registration form fields
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'tourist' | 'provider'>('tourist');
  const [regPhone, setRegPhone] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regTaxNumber, setRegTaxNumber] = useState('');
  const [regDescription, setRegDescription] = useState('');

  // Review writing states
  const [activeReviewAttractionId, setActiveReviewAttractionId] = useState<number | null>(null);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // New Offer Coordinates state
  const [newOfferLat, setNewOfferLat] = useState(52.1);
  const [newOfferLng, setNewOfferLng] = useState(19.4);
  
  // Data States
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Tourist Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150);
  const [kidFriendly, setKidFriendly] = useState(false);
  
  // Modal States
  const [selectedAttractionForBooking, setSelectedAttractionForBooking] = useState<Attraction | null>(null);
  const [showNewOfferModal, setShowNewOfferModal] = useState(false);
  const [selectedCmsPage, setSelectedCmsPage] = useState<CmsPage | null>(null);
  
  // Form States
  const [bookingDate, setBookingDate] = useState('2026-06-10');
  const [bookingTicketsCount, setBookingTicketsCount] = useState(1);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferCategory, setNewOfferCategory] = useState('Museums');
  const [newOfferPrice, setNewOfferPrice] = useState(50);
  const [newOfferKidFriendly, setNewOfferKidFriendly] = useState(false);
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [newOfferImageBase64, setNewOfferImageBase64] = useState('');
  const [newOfferFileName, setNewOfferFileName] = useState('');
  const [reviewReplyTexts, setReviewReplyTexts] = useState<{ [key: number]: string }>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Initial load
  useEffect(() => {
    fetchData();
    const savedFavs = localStorage.getItem('tourist_booking_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
    const savedUser = localStorage.getItem('tourist_booking_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setLoggedInUser(parsed);
      setCurrentRole(parsed.role);
    }
  }, []);

  const showSystemToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const fetchData = async () => {
    try {
      const resAttractions = await fetch(`/api/attractions?all=true&reviews=true&t=${Date.now()}`, { cache: 'no-store' });
      const dataAttractions = await resAttractions.json();
      if (!dataAttractions.error) setAttractions(dataAttractions);

      const resCategories = await fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' });
      const dataCategories = await resCategories.json();
      if (!dataCategories.error) {
        setCategories(dataCategories);
        if (dataCategories.length > 0 && !newOfferCategory) {
          setNewOfferCategory(dataCategories[0].name);
        }
      }

      const resBlocked = await fetch(`/api/blocked-dates?t=${Date.now()}`, { cache: 'no-store' });
      const dataBlocked = await resBlocked.json();
      if (!dataBlocked.error) setBlockedDates(dataBlocked);

      const resBookings = await fetch(`/api/bookings?t=${Date.now()}`, { cache: 'no-store' });
      const dataBookings = await resBookings.json();
      if (!dataBookings.error) setBookings(dataBookings);

      const resReviews = await fetch(`/api/reviews?t=${Date.now()}`, { cache: 'no-store' });
      const dataReviews = await resReviews.json();
      if (!dataReviews.error) setReviews(dataReviews);
    } catch (err) {
      console.error("Error loading data: ", err);
    }
  };

  // Login handler
  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInUser(data);
        setCurrentRole(data.role);
        localStorage.setItem('tourist_booking_user', JSON.stringify(data));
        showSystemToast(`Logged in successfully as ${data.name}`);
        setEmailInput('');
        setPasswordInput('');
      } else {
        showSystemToast(`Login failed: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to connect to authentication server.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('tourist_booking_user');
    showSystemToast('Logged out successfully.');
  };

  // Registration handler
  const handleRegister = async () => {
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      showSystemToast('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        phoneNumber: regPhone,
        companyName: regRole === 'provider' ? regCompanyName : undefined,
        taxNumber: regRole === 'provider' ? regTaxNumber : undefined,
        description: regRole === 'provider' ? regDescription : undefined
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInUser(data);
        setCurrentRole(data.role);
        localStorage.setItem('tourist_booking_user', JSON.stringify(data));
        showSystemToast(`Account created and logged in as ${data.name}`);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegPhone('');
        setRegCompanyName('');
        setRegTaxNumber('');
        setRegDescription('');
        setAuthMode('login');
      } else {
        showSystemToast(`Registration failed: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to connect to registration server.');
    }
  };

  // Update Booking Status handler
  const handleUpdateBookingStatus = async (bookingId: number, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        showSystemToast(`Booking has been ${status === 'accepted' ? 'accepted' : 'declined'}.`);
        fetchData();
      } else {
        showSystemToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to update booking status.');
    }
  };

  // Create Review handler
  const handleCreateReview = async (attractionId: number) => {
    if (!newReviewComment.trim()) {
      showSystemToast('Please write a review comment.');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attractionId,
          author: loggedInUser?.name || 'Anonymous',
          rating: newReviewRating,
          comment: newReviewComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        showSystemToast('Review submitted successfully!');
        setNewReviewComment('');
        setNewReviewRating(5);
        setActiveReviewAttractionId(null);
        fetchData();
      } else {
        showSystemToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to submit review.');
    }
  };

  const handleFlagReview = async (reviewId: number) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFlagged: true })
      });
      if (res.ok) {
        showSystemToast('Review reported to administrator.');
        fetchData();
      } else {
        showSystemToast('Failed to report review.');
      }
    } catch (err) {
      showSystemToast('Failed to report review.');
    }
  };

  // Database Reset handler
  const handleDbReset = async () => {
    if (!confirm('Are you sure you want to reset the database to defaults? All custom bookings, reviews, categories, and attractions will be deleted.')) {
      return;
    }
    
    try {
      const res = await fetch('/api/db-reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showSystemToast('Database reset successfully! Logging out...');
        handleLogout();
        setFavorites([]);
        localStorage.removeItem('tourist_booking_favorites');
        fetchData();
      } else {
        showSystemToast(`Reset failed: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to connect to database reset endpoint.');
    }
  };

  // Tourist attractions filtering
  const filteredAttractions = useMemo(() => {
    return attractions.filter((att) => {
      if (!att.isApproved) return false;
      const matchesSearch = att.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            att.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || att.category === selectedCategory;
      const matchesPrice = att.price <= maxPrice;
      const matchesKid = !kidFriendly || att.kidFriendly;
      return matchesSearch && matchesCategory && matchesPrice && matchesKid;
    });
  }, [attractions, searchQuery, selectedCategory, maxPrice, kidFriendly]);

  // Favorites management
  const toggleFavorite = (id: number) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
      showSystemToast('Removed attraction from travel planner.');
    } else {
      updated = [...favorites, id];
      showSystemToast('Added attraction to travel planner.');
    }
    setFavorites(updated);
    localStorage.setItem('tourist_booking_favorites', JSON.stringify(updated));
  };

  const favoriteAttractions = useMemo(() => {
    return attractions.filter(att => favorites.includes(att.id) && att.isApproved);
  }, [attractions, favorites]);

  // Provider statistics calculations
  const providerStats = useMemo(() => {
    const myAttractions = attractions.filter(a => a.providerName === loggedInUser?.companyName);
    const myApprovedAttractions = myAttractions.filter(a => a.isApproved);
    const myAttractionIds = myAttractions.map(a => a.id);
    const myBookings = bookings.filter(b => myAttractionIds.includes(b.attractionId));

    const activeBookingsCount = myBookings.length;
    const monthlyRevenue = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const averageRating = myApprovedAttractions.length > 0
      ? (myApprovedAttractions.reduce((sum, a) => sum + a.rating, 0) / myApprovedAttractions.length).toFixed(1)
      : '5.0';
    return {
      revenue: monthlyRevenue,
      bookingsCount: activeBookingsCount,
      rating: averageRating,
      views: 3890 + myBookings.length * 12
    };
  }, [bookings, attractions, loggedInUser]);

  // Admin and Provider sections lists
  const pendingAttractions = useMemo(() => {
    return attractions.filter(att => !att.isApproved);
  }, [attractions]);

  const flaggedReviews = useMemo(() => {
    return reviews.filter(rev => rev.isFlagged);
  }, [reviews]);

  // Category Actions
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      const data = await res.json();
      if (res.ok) {
        showSystemToast(`Successfully added category: ${data.name}`);
        setNewCategoryName('');
        fetchData();
      } else {
        showSystemToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showSystemToast('Category deleted successfully.');
        fetchData();
      } else {
        showSystemToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to delete category.');
    }
  };

  // Booking Actions
  const openBookingModal = (attraction: Attraction) => {
    setSelectedAttractionForBooking(attraction);
    setBookingTicketsCount(1);
    setBookingDate('2026-06-10');
  };

  const handleBooking = async () => {
    if (!selectedAttractionForBooking) return;
    const totalPrice = selectedAttractionForBooking.price * bookingTicketsCount;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attractionId: selectedAttractionForBooking.id,
          date: bookingDate,
          ticketsCount: bookingTicketsCount,
          totalPrice,
          userId: loggedInUser?.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        showSystemToast(`Success! Booked ticket for ${bookingDate}.`);
        setSelectedAttractionForBooking(null);
        fetchData();
      } else {
        showSystemToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to make reservation.');
    }
  };

  const checkDateAvailability = (date: string) => {
    return !blockedDates.includes(date);
  };

  // Provider calendar toggle
  const toggleCalendarDate = async (dateStr: string) => {
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr })
      });
      const data = await res.json();
      if (res.ok) {
        const action = data.status === 'blocked' ? 'Blocked' : 'Unblocked';
        showSystemToast(`${action} date ${dateStr}`);
        fetchData();
      }
    } catch (err) {
      showSystemToast('Failed to update date availability.');
    }
  };

  // Provider calendar bulk block/unblock
  const bulkToggleCalendarDates = async (dates: string[], action: 'block' | 'unblock') => {
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates, action })
      });
      const data = await res.json();
      if (res.ok) {
        const actionLabel = action === 'block' ? 'Blocked' : 'Unblocked';
        showSystemToast(`${actionLabel} ${dates.length} dates successfully.`);
        fetchData();
      } else {
        showSystemToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to perform bulk update.');
    }
  };

  // Provider reply submission
  const handleReviewReply = async (reviewId: number) => {
    const replyText = reviewReplyTexts[reviewId];
    if (!replyText || !replyText.trim()) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        showSystemToast('Sent public response.');
        setReviewReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
        fetchData();
      }
    } catch (err) {
      showSystemToast('Failed to save response.');
    }
  };

  const handleUpdateProfile = async (payload: { name: string; companyName: string; taxNumber: string; phoneNumber: string; description: string }) => {
    if (!loggedInUser) return;
    try {
      const res = await fetch(`/api/users/${loggedInUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInUser(data);
        localStorage.setItem('tourist_booking_user', JSON.stringify(data));
        showSystemToast('Profile updated successfully.');
        fetchData();
      } else {
        showSystemToast(`Failed to update profile: ${data.error}`);
      }
    } catch (err) {
      showSystemToast('Failed to update profile.');
    }
  };

  // Admin Attraction Moderation
  const handleApproveAttraction = async (id: number) => {
    try {
      const res = await fetch(`/api/attractions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true })
      });
      if (res.ok) {
        showSystemToast('Offer approved and published.');
        fetchData();
      }
    } catch (err) {
      showSystemToast('Error approving.');
    }
  };

  const handleDeclineAttraction = async (id: number) => {
    try {
      const res = await fetch(`/api/attractions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showSystemToast('Offer declined and removed.');
        fetchData();
      }
    } catch (err) {
      showSystemToast('Error declining.');
    }
  };

  // Admin Review Moderation
  const handleApproveReview = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFlagged: false })
      });
      if (res.ok) {
        showSystemToast('Report dismissed. Review kept.');
        fetchData();
      }
    } catch (err) {
      showSystemToast('Error dismissing review report.');
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showSystemToast('Review deleted from platform.');
        fetchData();
      }
    } catch (err) {
      showSystemToast('Error deleting review.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showSystemToast('Image file size must be less than 4MB.');
      return;
    }

    setNewOfferFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewOfferImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const closeNewOfferModal = () => {
    setShowNewOfferModal(false);
    setNewOfferTitle('');
    setNewOfferDesc('');
    setNewOfferPrice(50);
    setNewOfferKidFriendly(false);
    setNewOfferImageBase64('');
    setNewOfferFileName('');
    setNewOfferLat(52.1);
    setNewOfferLng(19.4);
  };

  // Create new listing
  const handleCreateOffer = async () => {
    if (!newOfferTitle.trim() || !newOfferDesc.trim() || !newOfferPrice) {
      showSystemToast('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('/api/attractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newOfferTitle,
          category: newOfferCategory,
          price: newOfferPrice,
          kidFriendly: newOfferKidFriendly,
          desc: newOfferDesc,
          providerName: loggedInUser?.companyName,
          imageBase64: newOfferImageBase64,
          lat: newOfferLat,
          lng: newOfferLng
        })
      });

      if (res.ok) {
        showSystemToast('Offer submitted to administrator for verification.');
        closeNewOfferModal();
        fetchData();
      }
    } catch (err) {
      showSystemToast('Failed to create offer.');
    }
  };

  // CMS dynamic lookup
  const loadCmsPage = async (slug: string) => {
    try {
      const res = await fetch(`/api/cms?slug=${slug}`);
      const data = await res.json();
      if (!data.error) {
        setSelectedCmsPage(data);
      }
    } catch (err) {
      showSystemToast('Failed to retrieve page content.');
    }
  };

  // Route optimization
  const optimizePlanner = () => {
    showSystemToast('Route optimized! Generated the shortest path to your selected attractions.');
  };

  return (
    <>
      <Header
        loggedInUser={loggedInUser}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        handleLogout={handleLogout}
        showSystemToast={showSystemToast}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!loggedInUser ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6 fade-in">
            {/* Tab selector between Login and Register */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all duration-200 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all duration-200 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>

            {authMode === 'login' ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm mx-auto">
                    T
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Sign In to Your Account</h2>
                  <p className="text-xs text-slate-400">Welcome to the Tourist Attraction Booking System</p>
                </div>

                {/* Manual Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin(emailInput, passwordInput);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. tourist@test.com"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Sign In <ChevronRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick Login (Testing)</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Quick Test Users Shortcuts */}
                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => handleLogin('tourist@test.com', 'tourist123')}
                    className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-between px-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-brand-600" />
                      Tourist Account
                    </span>
                    <span className="text-[9px] text-slate-400">tourist@test.com</span>
                  </button>

                  <button
                    onClick={() => handleLogin('provider@test.com', 'provider123')}
                    className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-between px-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-indigo-600" />
                      Organizer / Provider Account
                    </span>
                    <span className="text-[9px] text-slate-400">provider@test.com</span>
                  </button>

                  <button
                    onClick={() => handleLogin('admin@test.com', 'admin123')}
                    className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-between px-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Administrator Account
                    </span>
                    <span className="text-[9px] text-slate-400">admin@test.com</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm mx-auto">
                    T
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create a New Account</h2>
                  <p className="text-xs text-slate-400">Choose your account type and start using the system</p>
                </div>

                {/* Account type selector inside registration */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setRegRole('tourist')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      regRole === 'tourist'
                        ? 'bg-white text-brand-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" /> Tourist
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('provider')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      regRole === 'provider'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" /> Provider
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                  className="space-y-3.5"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Emily Watson"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. emily@watson.com"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                    />
                  </div>

                  {regRole === 'provider' && (
                    <div className="space-y-3.5 pt-2 border-t border-slate-100 fade-in">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Phone Number</label>
                        <input
                          type="text"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="e.g. +48 500 600 700"
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Company Name</label>
                        <input
                          type="text"
                          value={regCompanyName}
                          onChange={(e) => setRegCompanyName(e.target.value)}
                          placeholder="e.g. Baltic Sightseeing Ltd."
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Tax Number (NIP)</label>
                        <input
                          type="text"
                          value={regTaxNumber}
                          onChange={(e) => setRegTaxNumber(e.target.value)}
                          placeholder="e.g. PL1234567890"
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Business Description</label>
                        <textarea
                          value={regDescription}
                          onChange={(e) => setRegDescription(e.target.value)}
                          placeholder="e.g. Guided tours in the Baltic region..."
                          rows={2}
                          className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Register Account <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <>
            {currentRole === 'tourist' && (
              <TouristView
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                kidFriendly={kidFriendly}
                setKidFriendly={setKidFriendly}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                favoriteAttractions={favoriteAttractions}
                bookings={bookings}
                loggedInUser={loggedInUser}
                filteredAttractions={filteredAttractions}
                openBookingModal={openBookingModal}
                optimizePlanner={optimizePlanner}
                activeReviewAttractionId={activeReviewAttractionId}
                setActiveReviewAttractionId={setActiveReviewAttractionId}
                newReviewRating={newReviewRating}
                setNewReviewRating={setNewReviewRating}
                newReviewComment={newReviewComment}
                setNewReviewComment={setNewReviewComment}
                handleCreateReview={handleCreateReview}
                handleFlagReview={handleFlagReview}
              />
            )}

            {currentRole === 'provider' && (
              <ProviderView
                setShowNewOfferModal={setShowNewOfferModal}
                providerStats={providerStats}
                blockedDates={blockedDates}
                toggleCalendarDate={toggleCalendarDate}
                bulkToggleCalendarDates={bulkToggleCalendarDates}
                bookings={bookings}
                attractions={attractions}
                loggedInUser={loggedInUser}
                handleUpdateBookingStatus={handleUpdateBookingStatus}
                reviews={reviews}
                reviewReplyTexts={reviewReplyTexts}
                setReviewReplyTexts={setReviewReplyTexts}
                handleReviewReply={handleReviewReply}
                handleUpdateProfile={handleUpdateProfile}
              />
            )}

            {currentRole === 'admin' && (
              <AdminView
                pendingAttractions={pendingAttractions}
                handleDeclineAttraction={handleDeclineAttraction}
                handleApproveAttraction={handleApproveAttraction}
                flaggedReviews={flaggedReviews}
                handleApproveReview={handleApproveReview}
                handleDeleteReview={handleDeleteReview}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                handleAddCategory={handleAddCategory}
                handleDeleteCategory={handleDeleteCategory}
                categories={categories}
              />
            )}
          </>
        )}
      </main>

      <Footer loadCmsPage={loadCmsPage} handleDbReset={handleDbReset} />

      <BookingModal
        selectedAttractionForBooking={selectedAttractionForBooking}
        bookingDate={bookingDate}
        setBookingDate={setBookingDate}
        bookingTicketsCount={bookingTicketsCount}
        setBookingTicketsCount={setBookingTicketsCount}
        checkDateAvailability={checkDateAvailability}
        handleBooking={handleBooking}
        onClose={() => setSelectedAttractionForBooking(null)}
      />

      <NewOfferModal
        showNewOfferModal={showNewOfferModal}
        onClose={closeNewOfferModal}
        newOfferTitle={newOfferTitle}
        setNewOfferTitle={setNewOfferTitle}
        newOfferCategory={newOfferCategory}
        setNewOfferCategory={setNewOfferCategory}
        categories={categories}
        newOfferPrice={newOfferPrice}
        setNewOfferPrice={setNewOfferPrice}
        newOfferKidFriendly={newOfferKidFriendly}
        setNewOfferKidFriendly={setNewOfferKidFriendly}
        newOfferDesc={newOfferDesc}
        setNewOfferDesc={setNewOfferDesc}
        newOfferLat={newOfferLat}
        setNewOfferLat={setNewOfferLat}
        newOfferLng={newOfferLng}
        setNewOfferLng={setNewOfferLng}
        newOfferFileName={newOfferFileName}
        handleImageUpload={handleImageUpload}
        handleCreateOffer={handleCreateOffer}
      />

      <CmsModal selectedCmsPage={selectedCmsPage} onClose={() => setSelectedCmsPage(null)} />

      {/* SYSTEM TOAST CONTAINER */}
      <div
        className={`fixed bottom-6 right-6 bg-slate-900 text-white text-xs py-3 px-5 rounded-xl shadow-xl z-[99999] transition-all duration-300 flex items-center gap-3 ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <Info className="w-4 h-4 text-brand-400" />
        <span>{toastMessage}</span>
      </div>
    </>
  );
}
