import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-8 py-4 flex justify-between items-center shadow-xl border-b-2 border-blue-800">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-3xl">🏛️</span>
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
          Temple Crowd Management
        </span>
      </h1>
      <div className="flex space-x-1">
        <Link 
          to="/" 
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isActive('/') 
              ? 'bg-white bg-opacity-30 backdrop-blur-sm shadow-lg' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
           Home
        </Link>
        <Link 
          to="/booking" 
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isActive('/booking') 
              ? 'bg-white bg-opacity-30 backdrop-blur-sm shadow-lg' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
           Booking
        </Link>
        <Link 
          to="/admin" 
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isActive('/admin') 
              ? 'bg-white bg-opacity-30 backdrop-blur-sm shadow-lg' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
           Admin
        </Link>
        <Link 
          to="/simulator" 
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isActive('/simulator') 
              ? 'bg-white bg-opacity-30 backdrop-blur-sm shadow-lg' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
           Simulator
        </Link>
        <Link 
          to="/predict" 
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isActive('/predict') 
              ? 'bg-white bg-opacity-30 backdrop-blur-sm shadow-lg' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
           Predict
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
