import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { connectSocket, subscribeToCrowdUpdates, unsubscribeToCrowdUpdates } from "../utils/socket";

const Navbar = () => {
  const location = useLocation();
  const [zones, setZones] = useState([]);

  useEffect(() => {
    connectSocket();
    const onUpdate = (data) => {
      if (data && Array.isArray(data.zones)) setZones(data.zones);
    };
    subscribeToCrowdUpdates(onUpdate);
    return () => unsubscribeToCrowdUpdates();
  }, []);

  const bestTimeText = useMemo(() => {
    if (!zones.length) return "Best time: --";
    const avgOcc = zones.reduce((s, z) => s + ((Number(z.current)||0) / (Number(z.capacity)||1)), 0) / zones.length;
    if (avgOcc < 0.4) return "Best time: Now (low crowd)";
    if (avgOcc < 0.7) return "Best time: Later (6–8 AM / 7–9 PM)";
    return "Best time: 6–8 AM or 7–9 PM";
  }, [zones]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="text-white px-8 py-4 flex justify-between items-center shadow-xl border-b-2" style={{ backgroundColor: '#3C467B', borderColor: '#2c345d' }}>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-3xl">🏛️</span>
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
          Temple Crowd Management
        </span>
      </h1>
      <div className="hidden md:flex items-center text-sm mr-4">
        <span className="bg-white/20 px-3 py-1 rounded-full">{bestTimeText}</span>
      </div>
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
