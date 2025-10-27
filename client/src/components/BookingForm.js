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
        <h3 className="text-lg font-semibold mb-4 text-green-600">Booking Confirmed!</h3>
        <p className="mb-2 text-sm text-gray-600">Reference: {booking.bookingRef}</p>
        <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-sm">
          <QRCode value={booking.qrData} size={200} />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Show this QR code at the entrance
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/booking')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View My Bookings
          </button>
          <button
            onClick={() => setBooking(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Visitors
        </label>
        <input
          type="number"
          name="visitors"
          min="1"
          max="10"
          required
          value={formData.visitors}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="time"
          name="time"
          required
          value={formData.time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Book Visit
      </button>
    </form>
  );
};

export default BookingForm;
