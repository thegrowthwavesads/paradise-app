import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { MapPin, LogOut, Loader2 } from 'lucide-react';
import BookingCard from './BookingCard';
import BookingDetails from './BookingDetails';

const CustomerDashboard = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('customerEmail', '==', user.email),
        orderBy('startDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setLoading(false);
    }
  };

  const getBookingStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return 'upcoming';
    if (today >= start && today <= end) return 'current';
    return 'past';
  };

  const filterBookingsByStatus = (status) => {
    return bookings.filter(booking => getBookingStatus(booking.startDate, booking.endDate) === status);
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (selectedBooking) {
    return (
      <BookingDetails 
        booking={selectedBooking} 
        onBack={() => setSelectedBooking(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#eb3030'}}>
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-800">Paradise Tours</h1>
              <p className="text-xs text-gray-500">Customer Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['upcoming', 'current', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} ({filterBookingsByStatus(tab).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin" size={48} style={{color: '#eb3030'}} />
          </div>
        ) : filterBookingsByStatus(activeTab).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-light text-gray-800 mb-2">No {activeTab} bookings</h3>
            <p className="text-gray-500">Your {activeTab} trips will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterBookingsByStatus(activeTab).map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking}
                onClick={() => setSelectedBooking(booking)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
