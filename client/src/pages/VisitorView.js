import React, { useState } from 'react';
import CrowdMap from '../components/CrowdMap';
import BookingForm from '../components/BookingForm';
import PredictionChart from '../components/PredictionChart';

const VisitorView = () => {
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 gradient-text">
          Temple Visit Planning
        </h1>
        <p className="text-xl text-gray-600">Plan your visit with real-time crowd insights</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-modern card-shadow-hover">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🗺️</span>
            <h2 className="text-2xl font-bold text-gray-800">Current Crowd Density</h2>
          </div>
          <CrowdMap interactive={false} />
        </div>
        
        <div className="space-y-6">
          <div className="card-modern card-shadow-hover">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📈</span>
              <h2 className="text-2xl font-bold text-gray-800">Expected Crowd Levels</h2>
            </div>
            <PredictionChart onTimeSelect={setSelectedTime} />
          </div>
          
          <div className="card-modern card-shadow-hover">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📅</span>
              <h2 className="text-2xl font-bold text-gray-800">Book Your Visit</h2>
            </div>
            <BookingForm selectedTime={selectedTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorView;
