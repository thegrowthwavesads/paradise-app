import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, User, Phone, Car, Clock, CheckCircle, Ticket } from 'lucide-react';

const BookingDetails = ({ booking, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back to Bookings</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-800">{booking.packageName}</h1>
              <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <CheckCircle size={18} />
              <span className="font-medium text-sm">Confirmed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'itinerary', 'tickets', 'taxi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1" size={20} style={{color: '#eb3030'}} />
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="text-gray-800 font-medium">{booking.destination}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="mt-1" size={20} style={{color: '#eb3030'}} />
                  <div>
                    <p className="text-xs text-gray-500">Travel Dates</p>
                    <p className="text-gray-800 font-medium">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="mt-1" size={20} style={{color: '#eb3030'}} />
                  <div>
                    <p className="text-xs text-gray-500">Travelers</p>
                    <p className="text-gray-800 font-medium">{booking.travelers} Persons</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Accommodation</p>
                  <p className="text-gray-800 text-sm">{booking.accommodation}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Meal Plan</p>
                  <p className="text-gray-800 text-sm">{booking.mealPlan}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-green-700 mb-1">Total Amount</p>
                  <p className="text-2xl font-semibold text-green-800">{booking.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Day-by-Day Itinerary</h2>
            
            <div className="space-y-6">
              {Object.entries(booking.itinerary || {})
                .sort((a, b) => {
                  const getDayNum = (key) => parseInt(key.replace(/\D/g, '')) || 0;
                  return getDayNum(a[0]) - getDayNum(b[0]);
                })
                .map(([day, activities], idx, arr) => (
                <div key={idx} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{background: 'linear-gradient(to bottom right, #eb3030, #ff6b6b)'}}>
                      {day.replace('day', '').replace('_', '')}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 capitalize">{day.replace('_', ' ')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{activities}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {booking.tickets && booking.tickets.length > 0 ? (
              booking.tickets.map((ticket, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex">
                    <div className="w-2" style={{background: 'linear-gradient(to bottom right, #eb3030, #ff6b6b)'}}></div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <Ticket style={{color: '#eb3030'}} size={24} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{ticket.type} Ticket</p>
                            <p className="font-semibold text-gray-800 text-lg">
                              {ticket.from} → {ticket.to}
                            </p>
                          </div>
                        </div>
                        {ticket.pnr && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">PNR Number</p>
                            <p className="font-mono font-semibold text-gray-800">{ticket.pnr}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {ticket.date && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="text-sm font-medium text-gray-800">
                              {new Date(ticket.date).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        )}
                        {ticket.time && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Time</p>
                            <p className="text-sm font-medium text-gray-800">{ticket.time}</p>
                          </div>
                        )}
                        {ticket.seats && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Seats</p>
                            <p className="text-sm font-medium text-gray-800">{ticket.seats}</p>
                          </div>
                        )}
                      </div>

                      {ticket.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-700 mb-1">Additional Information</p>
                          <p className="text-sm text-blue-900">{ticket.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Ticket className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-gray-500">No tickets added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Taxi Tab */}
        {activeTab === 'taxi' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Taxi Details</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car style={{color: '#eb3030'}} size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                    <p className="text-lg font-semibold text-gray-800">{booking.taxi?.vehicleType}</p>
                    <p className="text-sm text-gray-600">{booking.taxi?.vehicleNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User style={{color: '#eb3030'}} size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Driver</p>
                    <p className="text-lg font-semibold text-gray-800">{booking.taxi?.driverName}</p>
                    <a href={`tel:${booking.taxi?.driverPhone}`} className="text-sm hover:underline flex items-center space-x-1" style={{color: '#eb3030'}}>
                      <Phone size={14} />
                      <span>{booking.taxi?.driverPhone}</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-4">Pickup Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-gray-800 font-medium">{booking.taxi?.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Time</p>
                    <p className="text-gray-800 font-medium">{booking.taxi?.pickupTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="text-gray-800 font-medium">{formatDate(booking.startDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingDetails;
