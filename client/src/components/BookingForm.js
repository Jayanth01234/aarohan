import React, { useState } from "react";
import QRCode from "qrcode.react";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ selectedTime }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    visitors: 1,
    date: new Date().toISOString().split("T")[0],
    time: selectedTime || "",
  });

  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingRef =
      "BK" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const newBooking = {
      ...formData,
      bookingRef,
      qrData: JSON.stringify({
        ref: bookingRef,
        name: formData.name,
        visitors: formData.visitors,
        date: formData.date,
        time: formData.time,
      }),
    };

    setBooking(newBooking);

    // Save locally
    const existingBookings = JSON.parse(
      localStorage.getItem("templeBookings") || "[]"
    );
    existingBookings.push(newBooking);
    localStorage.setItem("templeBookings", JSON.stringify(existingBookings));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Booking Success Screen
  if (booking) {
    return (
      <div className="text-center animate-fade-in">
        <div className="mb-6">
          <div className="inline-block p-5 rounded-full bg-green-100 mb-4 shadow-sm">
            <span className="text-5xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-1">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 text-base">
            Reference ID:{" "}
            <span className="font-semibold text-blue-700">
              {booking.bookingRef}
            </span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl inline-block mb-6 shadow-md border border-blue-200">
          <QRCode value={booking.qrData} size={220} />
        </div>

        <p className="text-gray-700 text-sm mb-6">
          Show this QR code at the entrance for quick check-in
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/booking")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            View My Bookings
          </button>
          <button
            onClick={() => setBooking(null)}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Booking Form
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🛕 Temple Visit Booking
      </h2>

      {[
        { name: "name", label: "Name", icon: "👤", type: "text", placeholder: "Enter your full name" },
        { name: "email", label: "Email", icon: "✉️", type: "email", placeholder: "your.email@example.com" },
        { name: "visitors", label: "Number of Visitors", icon: "👥", type: "number", min: 1, max: 10 },
        { name: "date", label: "Date", icon: "📅", type: "date", min: new Date().toISOString().split("T")[0] },
        { name: "time", label: "Time", icon: "⏰", type: "time" },
      ].map(({ name, label, icon, ...props }) => (
        <div key={name}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>{icon}</span> {label}
          </label>
          <input
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required
            {...props}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none transition-all text-gray-800 placeholder-gray-400 shadow-sm"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
      >
        🎫 Book Visit
      </button>
    </form>
  );
};

export default BookingForm;
