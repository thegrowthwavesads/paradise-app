import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Phone, Car, FileText, Clock, CheckCircle, Ticket, LogOut, Loader2 } from 'lucide-react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isHovered, setIsHovered] = useState(false)

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
  }

  const taxiDetails = {
    vehicleType: 'Toyota Innova Crysta',
    vehicleNumber: 'JK01 AB 1234',
    driverName: 'Mohammed Rashid',
    driverPhone: '+91 98765 43210',
    pickupTime: '08:00 AM',
    pickupLocation: 'Srinagar Airport'
  }

  const tickets = [
    { type: 'Flight', from: 'Delhi', to: 'Srinagar', date: '2024-02-15', time: '06:30 AM', pnr: 'ABC123' },
    { type: 'Flight', from: 'Srinagar', to: 'Delhi', date: '2024-02-21', time: '05:00 PM', pnr: 'XYZ789' }
  ]

  const itinerary = [
    { day: 1, title: 'Arrival in Srinagar', activities: ['Airport pickup', 'Houseboat check-in', 'Shikara ride', 'Dinner'] },
    { day: 2, title: 'Srinagar Sightseeing', activities: ['Mughal Gardens', 'Hazratbal Shrine', 'Lal Chowk'] },
    { day: 3, title: 'Gulmarg', activities: ['Gondola ride', 'Snow activities'] },
    { day: 4, title: 'Pahalgam', activities: ['Betaab Valley', 'Aru Valley'] },
    { day: 5, title: 'Back to Srinagar', activities: ['Market visit', 'Dal Lake'] },
    { day: 6, title: 'Sonamarg', activities: ['Thajiwas Glacier'] },
    { day: 7, title: 'Departure', activities: ['Airport drop'] }
  ]

  const handleLogin = () => {
    if (phoneNumber.length === 10) setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
          <h1 className="text-2xl mb-4 text-center">Paradise Tours</h1>
          <input
            className="w-full border p-3 rounded mb-4"
            placeholder="Enter phone number"
            maxLength={10}
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
          <button
            className="w-full bg-red-600 text-white p-3 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 flex justify-between">
        <div className="flex items-center gap-2">
          <MapPin />
          <span>Paradise Tours</span>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ color: isHovered ? '#eb3030' : undefined }}
        >
          <LogOut />
        </button>
      </header>

      <nav className="flex gap-6 bg-white border-b px-4">
        {['overview', 'itinerary', 'tickets', 'taxi'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-2">{bookingData.tourName}</h2>
            <p>{bookingData.destination}</p>
            <p>{bookingData.totalAmount} – {bookingData.paymentStatus}</p>
          </div>
        )}

        {activeTab === 'itinerary' && itinerary.map(d => (
          <div key={d.day} className="bg-white p-4 mb-3 rounded shadow">
            <strong>Day {d.day}:</strong> {d.title}
          </div>
        ))}

        {activeTab === 'tickets' && tickets.map(t => (
          <div key={t.pnr} className="bg-white p-4 mb-3 rounded shadow">
            {t.from} → {t.to} ({t.pnr})
          </div>
        ))}

        {activeTab === 'taxi' && (
          <div className="bg-white p-6 rounded shadow">
            <p>{taxiDetails.vehicleType}</p>
            <p>{taxiDetails.driverName}</p>
            <a href={`tel:${taxiDetails.driverPhone}`}>{taxiDetails.driverPhone}</a>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
