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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Book a Visit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.bookingRef} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-blue-600">{booking.bookingRef}</h3>
              <button
                onClick={() => handleDeleteBooking(booking.bookingRef)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <p><span className="font-medium">Name:</span> {booking.name}</p>
              <p><span className="font-medium">Email:</span> {booking.email}</p>
              <p><span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {booking.time}</p>
              <p><span className="font-medium">Visitors:</span> {booking.visitors}</p>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-xs text-gray-600 text-center mb-3">
                Show this QR code at the entrance
              </p>
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                  <QRCode value={booking.qrData} size={150} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Book Another Visit
        </Link>
      </div>
    </div>
  );
};

export default MyBookings;

