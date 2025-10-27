import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">Temple Crowd Management</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-200">Home</Link>
        <Link to="/admin" className="hover:text-gray-200">Admin</Link>
        <Link to="/booking" className="hover:text-gray-200">Booking</Link>
      </div>
    </nav>
  );
};

export default Navbar;
