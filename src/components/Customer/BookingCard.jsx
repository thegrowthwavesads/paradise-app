import React from 'react';
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react';

const BookingCard = ({ booking, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="h-2" style={{background: 'linear-gradient(to right, #eb3030, #ff6b6b)'}}></div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{booking.packageName}</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <MapPin className="flex-shrink-0 mt-0.5" size={18} style={{color: '#eb3030'}} />
            <div className="text-sm">
              <p className="text-gray-500">Destination</p>
              <p className="text-gray-800 font-medium">{booking.destination}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="flex-shrink-0 mt-0.5" size={18} style={{color: '#eb3030'}} />
            <div className="text-sm">
              <p className="text-gray-500">Travel Dates</p>
              <p className="text-gray-800 font-medium">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Users className="flex-shrink-0 mt-0.5" size={18} style={{color: '#eb3030'}} />
            <div className="text-sm">
              <p className="text-gray-500">Travelers</p>
              <p className="text-gray-800 font-medium">{booking.travelers} Person{booking.travelers > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">View Details</span>
          <ChevronRight size={20} style={{color: '#eb3030'}} />
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
