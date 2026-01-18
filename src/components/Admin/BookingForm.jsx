import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const BookingForm = ({ booking, packages, onClose }) => {
  const [formData, setFormData] = useState({
    customerEmail: booking?.customerEmail || '',
    customerName: booking?.customerName || '',
    customerPhone: booking?.customerPhone || '',
    packageId: booking?.packageId || '',
    startDate: booking?.startDate || '',
    endDate: booking?.endDate || '',
    travelers: booking?.travelers || 1,
    pricingOption: booking?.pricingOption || '',
    totalAmount: booking?.totalAmount || '',
    accommodation: booking?.accommodation || '',
    mealPlan: booking?.mealPlan || '',
    driverName: booking?.taxi?.driverName || '',
    driverPhone: booking?.taxi?.driverPhone || '',
    vehicleType: booking?.taxi?.vehicleType || '',
    vehicleNumber: booking?.taxi?.vehicleNumber || '',
    pickupLocation: booking?.taxi?.pickupLocation || '',
    pickupTime: booking?.taxi?.pickupTime || ''
  });

  const [tickets, setTickets] = useState(booking?.tickets || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const addTicket = () => {
    setTickets([...tickets, {
      type: 'Flight',
      from: '',
      to: '',
      date: '',
      time: '',
      pnr: '',
      seats: '',
      notes: ''
    }]);
  };

  const updateTicket = (index, field, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  const removeTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const getBookingStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return 'upcoming';
    if (today >= start && today <= end) return 'current';
    return 'past';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerEmail || !formData.customerName || !formData.customerPhone) {
      setError('Please fill in all customer details');
      return;
    }
    if (!formData.packageId || !formData.startDate || !formData.endDate) {
      setError('Please fill in package and date details');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const selectedPackage = packages.find(p => p.id === formData.packageId);

      const bookingData = {
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        packageId: formData.packageId,
        packageName: selectedPackage?.package_name || '',
        destination: selectedPackage?.destination || '',
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: parseInt(formData.travelers),
        pricingOption: formData.pricingOption,
        totalAmount: formData.totalAmount,
        accommodation: formData.accommodation,
        mealPlan: formData.mealPlan,
        itinerary: selectedPackage?.itinerary || {},
        tickets: tickets,
        taxi: {
          driverName: formData.driverName,
          driverPhone: formData.driverPhone,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          pickupLocation: formData.pickupLocation,
          pickupTime: formData.pickupTime
        },
        status: getBookingStatus(formData.startDate, formData.endDate),
        createdAt: booking?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (booking) {
        await updateDoc(doc(db, 'bookings', booking.id), bookingData);
      } else {
        await addDoc(collection(db, 'bookings'), bookingData);
      }

      setUploading(false);
      onClose();
    } catch (err) {
      console.error('Error saving booking:', err);
      setError('Failed to save booking. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-light text-gray-800">
            {booking ? 'Edit Booking' : 'Add New Booking'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package *</label>
                <select
                  value={formData.packageId}
                  onChange={(e) => handleInputChange('packageId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.package_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Option</label>
                <input
                  type="text"
                  value={formData.pricingOption}
                  onChange={(e) => handleInputChange('pricingOption', e.target.value)}
                  placeholder="e.g., Deluxe, Super Deluxe"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travelers *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={(e) => handleInputChange('travelers', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                <input
                  type="text"
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                  placeholder="₹ 50,000"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation</label>
                <input
                  type="text"
                  value={formData.accommodation}
                  onChange={(e) => handleInputChange('accommodation', e.target.value)}
                  placeholder="e.g., 4-Star Hotel"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Plan</label>
                <input
                  type="text"
                  value={formData.mealPlan}
                  onChange={(e) => handleInputChange('mealPlan', e.target.value)}
                  placeholder="e.g., Breakfast Included"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tickets</h3>
              <button
                type="button"
                onClick={addTicket}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all"
                style={{backgroundColor: '#eb3030'}}
              >
                <Plus size={18} />
                <span>Add Ticket</span>
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                No tickets added yet. Click "Add Ticket" to add flight/train/bus details.
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Ticket {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTicket(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={ticket.type}
                          onChange={(e) => updateTicket(index, 'type', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Flight">Flight</option>
                          <option value="Train">Train</option>
                          <option value="Bus">Bus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                        <input
                          type="text"
                          value={ticket.from}
                          onChange={(e) => updateTicket(index, 'from', e.target.value)}
                          placeholder="e.g., Delhi"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                        <input
                          type="text"
                          value={ticket.to}
                          onChange={(e) => updateTicket(index, 'to', e.target.value)}
                          placeholder="e.g., Srinagar"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={ticket.date}
                          onChange={(e) => updateTicket(index, 'date', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={ticket.time}
                          onChange={(e) => updateTicket(index, 'time', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PNR Number</label>
                        <input
                          type="text"
                          value={ticket.pnr}
                          onChange={(e) => updateTicket(index, 'pnr', e.target.value)}
                          placeholder="e.g., ABC123"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seats (Optional)</label>
                        <input
                          type="text"
                          value={ticket.seats}
                          onChange={(e) => updateTicket(index, 'seats', e.target.value)}
                          placeholder="e.g., 12A, 12B"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <input
                          type="text"
                          value={ticket.notes}
                          onChange={(e) => updateTicket(index, 'notes', e.target.value)}
                          placeholder="Additional information"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Taxi Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxi Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Phone</label>
                <input
                  type="tel"
                  value={formData.driverPhone}
                  onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <input
                  type="text"
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  placeholder="e.g., Toyota Innova"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  placeholder="e.g., KA01 AB 1234"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                  placeholder="e.g., Airport"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              style={{backgroundColor: '#eb3030'}}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{booking ? 'Update Booking' : 'Create Booking'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
