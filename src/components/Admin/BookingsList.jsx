import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Edit, Trash2, Loader2 } from 'lucide-react';

const BookingsList = ({ bookings, onEdit, onRefresh, loading }) => {
  const getBookingStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return 'upcoming';
    if (today >= start && today <= end) return 'current';
    return 'past';
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        onRefresh();
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{color: '#eb3030'}} />
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500 text-lg">No bookings yet</p>
        <p className="text-gray-400 text-sm mt-2">Add your first booking to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Travelers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                  <div className="text-xs text-gray-400">{booking.customerPhone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{booking.packageName}</div>
                  <div className="text-xs text-gray-500">{booking.destination}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatDate(booking.startDate)}</div>
                  <div>{formatDate(booking.endDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.travelers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    getBookingStatus(booking.startDate, booking.endDate) === 'upcoming' 
                      ? 'bg-blue-100 text-blue-800' 
                      : getBookingStatus(booking.startDate, booking.endDate) === 'current' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getBookingStatus(booking.startDate, booking.endDate)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(booking)}
                    className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center"
                    title="Edit booking"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center"
                    title="Delete booking"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsList;
