import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ selectedTime }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    visitors: 1,
    date: new Date().toISOString().split('T')[0],
    time: selectedTime || '',
  });
  
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to the backend
    // For demo, we'll create a mock booking
    const bookingRef = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newBooking = {
      ...formData,
      bookingRef,
      qrData: JSON.stringify({
        ref: bookingRef,
        name: formData.name,
        visitors: formData.visitors,
        date: formData.date,
        time: formData.time,
      })
    };
    
    setBooking(newBooking);
    
    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('templeBookings') || '[]');
    existingBookings.push(newBooking);
    localStorage.setItem('templeBookings', JSON.stringify(existingBookings));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (booking) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
            <span className="text-5xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
          <p className="text-lg text-gray-600 mb-4">Your booking reference: <span className="font-bold text-blue-600">{booking.bookingRef}</span></p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl inline-block mb-6 shadow-lg border-2 border-blue-200">
          <QRCode value={booking.qrData} size={220} />
        </div>
        
        <p className="text-base text-gray-700 mb-6 font-medium">
          Show this QR code at the entrance for quick entry
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/booking')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <span></span>
            View My Bookings
          </button>
          <button
            onClick={() => setBooking(null)}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>👤</span> Name
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>✉️</span> Email
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>👥</span> Number of Visitors
        </label>
        <input
          type="number"
          name="visitors"
          min="1"
          max="10"
          required
          value={formData.visitors}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>📅</span> Date
        </label>
        <input
          type="date"
          name="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.date}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>⏰</span> Time
        </label>
        <input
          type="time"
          name="time"
          required
          value={formData.time}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <span>🎫</span>
        Book Visit
      </button>
    </form>
  );
};

export default BookingForm;
