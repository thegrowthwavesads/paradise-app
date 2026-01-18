import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Phone, Car, FileText, Clock, CheckCircle, Ticket, LogOut, Loader2 } from 'lucide-react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Dummy data
  const bookingData = {
    bookingId: 'PT2024-1523',
    status: 'Confirmed',
    tourName: 'Kashmir Paradise - 7 Days',
    destination: 'Srinagar, Gulmarg, Pahalgam',
    startDate: '2024-02-15',
    endDate: '2024-02-21',
    travelers: 4,
    totalAmount: '₹85,000',
    paymentStatus: 'Paid',
    accommodation: 'Deluxe Houseboat & 4-Star Hotels',
    mealPlan: 'Breakfast & Dinner Included'
  };

  const taxiDetails = {
    vehicleType: 'Toyota Innova Crysta',
    vehicleNumber: 'JK01 AB 1234',
    driverName: 'Mohammed Rashid',
    driverPhone: '+91 98765 43210',
    pickupTime: '08:00 AM',
    pickupLocation: 'Srinagar Airport'
  };

  const tickets = [
    { type: 'Flight', from: 'Delhi', to: 'Srinagar', date: '2024-02-15', time: '06:30 AM', pnr: 'ABC123' },
    { type: 'Flight', from: 'Srinagar', to: 'Delhi', date: '2024-02-21', time: '05:00 PM', pnr: 'XYZ789' }
  ];

  const itinerary = [
    { day: 1, title: 'Arrival in Srinagar', activities: ['Airport pickup', 'Check-in to Houseboat', 'Shikara ride on Dal Lake', 'Dinner at houseboat'] },
    { day: 2, title: 'Srinagar Local Sightseeing', activities: ['Mughal Gardens visit', 'Hazratbal Shrine', 'Shopping at Lal Chowk', 'Evening free'] },
    { day: 3, title: 'Gulmarg Excursion', activities: ['Drive to Gulmarg (2 hrs)', 'Gondola ride', 'Snow activities', 'Return to Srinagar'] },
    { day: 4, title: 'Pahalgam Valley', activities: ['Drive to Pahalgam', 'Betaab Valley visit', 'Aru Valley exploration', 'Overnight at hotel'] },
    { day: 5, title: 'Pahalgam to Srinagar', activities: ['Leisure morning', 'Drive back to Srinagar', 'Local market visit', 'Evening at Dal Lake'] },
    { day: 6, title: 'Sonamarg Day Trip', activities: ['Early morning departure', 'Thajiwas Glacier visit', 'Photography stops', 'Return by evening'] },
    { day: 7, title: 'Departure', activities: ['Breakfast', 'Check-out', 'Airport transfer', 'Flight to Delhi'] }
  ];

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved');
        }
      });
    }
  }, []);

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = `+91${phoneNumber}`;
      
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            console.log('reCAPTCHA solved');
          }
        });
      }
      
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', err);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(otp);
      setIsLoggedIn(true);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setError('Invalid OTP. Please try again.');
      console.error('Error verifying OTP:', err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPhoneNumber('');
    setOtp('');
    setShowOtpInput(false);
    setError('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#eb3030'}}>
              <MapPin className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-light text-gray-800 mb-2">Paradise Tours</h1>
            <p className="text-gray-500 text-sm">Welcome back, traveler</p>
          </div>
          
          <div className="space-y-6">
            {!showOtpInput ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg">
                      <span className="text-gray-600 text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(value);
                        setError('');
                      }}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      maxLength="10"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleSendOTP}
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{backgroundColor: '#eb3030'}}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  You will receive a 6-digit OTP via SMS
                </p>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                    <button
                      onClick={() => {
                        setShowOtpInput(false);
                        setOtp('');
                        setError('');
                      }}
                      className="text-xs hover:underline"
                      style={{color: '#eb3030'}}
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setOtp(value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-2xl tracking-widest"
                    maxLength="6"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    OTP sent to +91 {phoneNumber}
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{backgroundColor: '#eb3030'}}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Login</span>
                  )}
                </button>
                
                <div className="text-center">
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-sm hover:underline disabled:opacity-50"
                    style={{color: '#eb3030'}}
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* reCAPTCHA container - invisible */}
          <div id="recaptcha-container"></div>
        </div>
      </div>
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
            className="flex items-center space-x-2 text-gray-600 transition-colors"
            style={{color: isHovered ? '#eb3030' : undefined}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {['overview', 'itinerary', 'tickets', 'taxi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={activeTab === tab ? {borderColor: '#eb3030', color: '#eb3030'} : {}}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Booking Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4" style={{background: 'linear-gradient(to right, #eb3030, #ff6b6b)'}}>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm opacity-90">Booking ID</p>
                    <p className="text-xl font-semibold">{bookingData.bookingId}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <CheckCircle size={18} />
                    <span className="font-medium">{bookingData.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-light text-gray-800 mb-6">{bookingData.tourName}</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="mt-1" size={20} style={{color: '#eb3030'}} />
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-gray-800 font-medium">{bookingData.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="mt-1" size={20} style={{color: '#eb3030'}} />
                      <div>
                        <p className="text-xs text-gray-500">Travel Dates</p>
                        <p className="text-gray-800 font-medium">
                          {new Date(bookingData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(bookingData.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <User className="mt-1" size={20} style={{color: '#eb3030'}} />
                      <div>
                        <p className="text-xs text-gray-500">Travelers</p>
                        <p className="text-gray-800 font-medium">{bookingData.travelers} Persons</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-2">Accommodation</p>
                      <p className="text-gray-800 text-sm">{bookingData.accommodation}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-2">Meal Plan</p>
                      <p className="text-gray-800 text-sm">{bookingData.mealPlan}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-green-700 mb-1">Total Amount</p>
                      <p className="text-2xl font-semibold text-green-800">{bookingData.totalAmount}</p>
                      <p className="text-xs text-green-600 mt-1">✓ {bookingData.paymentStatus}</p>
                    </div>
                  </div>
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
              {itinerary.map((day, idx) => (
                <div key={idx} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{background: 'linear-gradient(to bottom right, #eb3030, #ff6b6b)'}}>
                      {day.day}
                    </div>
                    {idx < itinerary.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">{day.title}</h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="flex items-start space-x-2 text-gray-600 text-sm">
                          <Clock size={16} className="mt-0.5 flex-shrink-0" style={{color: '#eb3030'}} />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Your Tickets</h2>
            
            {tickets.map((ticket, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex">
                  <div className="w-2" style={{background: 'linear-gradient(to bottom right, #eb3030, #ff6b6b)'}}></div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Ticket style={{color: '#eb3030'}} size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{ticket.type} Ticket</p>
                          <p className="font-semibold text-gray-800">PNR: {ticket.pnr}</p>
                        </div>
                      </div>
                      <button className="text-sm font-medium hover:underline" style={{color: '#eb3030'}}>
                        Download
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{ticket.from}</p>
                        <p className="text-sm text-gray-500">{ticket.date}</p>
                      </div>
                      
                      <div className="flex-1 mx-4">
                        <div className="border-t-2 border-dashed border-gray-300 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2">
                            <span className="text-xs text-gray-500">{ticket.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{ticket.to}</p>
                        <p className="text-sm text-gray-500">Arrival</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                    <p className="text-lg font-semibold text-gray-800">{taxiDetails.vehicleType}</p>
                    <p className="text-sm text-gray-600">{taxiDetails.vehicleNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User style={{color: '#eb3030'}} size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Driver</p>
                    <p className="text-lg font-semibold text-gray-800">{taxiDetails.driverName}</p>
                    <a href={`tel:${taxiDetails.driverPhone}`} className="text-sm hover:underline flex items-center space-x-1" style={{color: '#eb3030'}}>
                      <Phone size={14} />
                      <span>{taxiDetails.driverPhone}</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-4">Pickup Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-gray-800 font-medium">{taxiDetails.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Time</p>
                    <p className="text-gray-800 font-medium">{taxiDetails.pickupTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="text-gray-800 font-medium">{new Date(bookingData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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

export default App;
