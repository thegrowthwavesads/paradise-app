import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { MapPin, LogOut, Package, Users, Plus } from 'lucide-react';
import BookingsList from './BookingsList';
import CustomersList from './CustomersList';
import BookingForm from './BookingForm';

const AdminDashboard = ({ user }) => {
  const [adminView, setAdminView] = useState('bookings');
  const [allBookings, setAllBookings] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load all bookings
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllBookings(bookingsData);

      // Load all customers
      const usersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'customer'))
      );
      const customersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllCustomers(customersData);

      // Load packages
      const packagesSnapshot = await getDocs(collection(db, 'packages'));
      const packagesData = packagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPackages(packagesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleAddNewBooking = () => {
    setEditingBooking(null);
    setShowBookingForm(true);
  };

  const handleFormClose = () => {
    setShowBookingForm(false);
    setEditingBooking(null);
    loadAdminData();
  };

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
              <p className="text-xs text-gray-500">Admin Dashboard</p>
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

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setAdminView('bookings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              adminView === 'bookings' 
                ? 'text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            style={adminView === 'bookings' ? {backgroundColor: '#eb3030'} : {}}
          >
            <Package className="inline mr-2" size={18} />
            Bookings ({allBookings.length})
          </button>
          
          <button
            onClick={() => setAdminView('customers')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              adminView === 'customers' 
                ? 'text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            style={adminView === 'customers' ? {backgroundColor: '#eb3030'} : {}}
          >
            <Users className="inline mr-2" size={18} />
            Customers ({allCustomers.length})
          </button>
          
          <button
            onClick={handleAddNewBooking}
            className="px-4 py-2 rounded-lg font-medium text-white ml-auto shadow-md hover:shadow-lg transition-all"
            style={{backgroundColor: '#eb3030'}}
          >
            <Plus className="inline mr-2" size={18} />
            Add New Booking
          </button>
        </div>

        {/* Content */}
        {adminView === 'bookings' && (
          <BookingsList 
            bookings={allBookings}
            onEdit={handleEditBooking}
            onRefresh={loadAdminData}
            loading={loading}
          />
        )}

        {adminView === 'customers' && (
          <CustomersList 
            customers={allCustomers}
            bookings={allBookings}
            loading={loading}
          />
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          booking={editingBooking}
          packages={packages}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
