import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('templeBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const handleDeleteBooking = (bookingRef) => {
    const updatedBookings = bookings.filter(booking => booking.bookingRef !== bookingRef);
    setBookings(updatedBookings);
    localStorage.setItem('templeBookings', JSON.stringify(updatedBookings));
  };

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 gradient-text">My Bookings</h1>
          <p className="text-xl text-gray-600">Manage your temple visit bookings</p>
        </div>
        
        <div className="max-w-2xl mx-auto card-modern text-center">
          <div className="py-12">
            <div className="inline-block p-6 rounded-full bg-blue-100 mb-6">
              <span className="text-6xl">📋</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No bookings yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Start planning your visit to get started</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <span>🎫</span>
              Book Your First Visit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 gradient-text">My Bookings</h1>
        <p className="text-xl text-gray-600">You have {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {bookings.map((booking, index) => (
          <div key={booking.bookingRef} className="card-modern card-shadow-hover transition-transform hover:scale-105">
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-100">
              <div>
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-sm mb-2">
                  {booking.bookingRef}
                </div>
                <div className="text-xs text-gray-600 mb-1">Queue No: <span className="font-semibold">{index + 1}</span></div>
                <h3 className="text-lg font-bold text-gray-800">{booking.name}</h3>
              </div>
              <button
                onClick={() => handleDeleteBooking(booking.bookingRef)}
                className="text-red-500 hover:text-red-700 text-xl px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete booking"
              >
                🗑️
              </button>
            </div>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">✉️</span>
                <span className="truncate">{booking.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">📅</span>
                <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">⏰</span>
                <span className="font-medium">{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">👥</span>
                <span className="font-medium">{booking.visitors} {booking.visitors === 1 ? 'visitor' : 'visitors'}</span>
              </div>
            </div>
            
            <div className="border-t-2 border-gray-100 pt-6">
              <p className="text-xs text-gray-600 text-center mb-4 font-medium uppercase tracking-wide">
                Show at Entrance
              </p>
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl border-2 border-blue-200 shadow-inner">
                  <QRCode value={booking.qrData} size={180} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <span>➕</span>
          Book Another Visit
        </Link>
      </div>
    </div>
  );
};

export default MyBookings;
