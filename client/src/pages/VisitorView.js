import React, { useState } from 'react';
import CrowdMap from '../components/CrowdMap';
import BookingForm from '../components/BookingForm';
import PredictionChart from '../components/PredictionChart';

const VisitorView = () => {
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Temple Visit Planning</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Crowd Density</h2>
          <CrowdMap interactive={false} />
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Expected Crowd Levels</h2>
            <PredictionChart onTimeSelect={setSelectedTime} />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Book Your Visit</h2>
            <BookingForm selectedTime={selectedTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorView;