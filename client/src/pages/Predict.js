import React, { useState } from 'react';
import PredictiveCalendar from '../components/PredictiveCalendar';
import DayPredictionChart from '../components/DayPredictionChart';
import { getSpecialDaysInMonth, DAY_TYPES } from '../utils/specialDays';

const Predict = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'monthly'

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Get upcoming special days
  const today = new Date();
  const upcomingSpecialDays = getSpecialDaysInMonth(today.getFullYear(), today.getMonth())
    .filter(day => new Date(day.date) >= today)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Predictive Analysis</h1>
        <p className="text-gray-600">
          Plan your visit by checking crowd predictions for specific dates, including holidays and festivals
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'calendar'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📅 Calendar View
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'monthly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 Monthly Overview
          </button>
        </div>
      </div>

      {/* Upcoming Special Days Banner */}
      {upcomingSpecialDays.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
            <span className="mr-2">🎉</span>
            Upcoming Special Days
          </h3>
          <div className="flex flex-wrap gap-2">
            {upcomingSpecialDays.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(new Date(day.date))}
                className="px-3 py-1 bg-white rounded-full text-sm font-medium text-purple-700 hover:bg-purple-100 transition"
              >
                {day.name} - {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <PredictiveCalendar 
              onDateSelect={handleDateSelect} 
              selectedDate={selectedDate}
            />
          </div>

          {/* Prediction Chart */}
          <div>
            <DayPredictionChart selectedDate={selectedDate} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Monthly Crowd Patterns</h2>
          
          {/* Day Type Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(DAY_TYPES).map(([key, { label, color, multiplier }]) => (
              <div key={key} className="text-center p-4 rounded-lg border" style={{ borderColor: color }}>
                <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: color }} />
                <h4 className="font-semibold text-sm text-gray-800">{label}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((multiplier - 1) * 100)}% {multiplier >= 1 ? 'higher' : 'lower'}
                </p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Planning Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Weekdays typically have 40% less crowd than weekends</li>
                <li>• Festival days can see up to 3x normal crowd levels</li>
                <li>• Early morning (6-8 AM) is usually the least crowded time</li>
                <li>• Book in advance for special days and holidays</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Best Practices</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Check weather forecasts before your visit</li>
                <li>• Arrive 30 minutes before peak hours</li>
                <li>• Use the booking system to secure your slot</li>
                <li>• Follow crowd management guidelines on busy days</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Average Daily Visitors</h4>
          <p className="text-2xl font-bold text-gray-800">2,500</p>
          <p className="text-xs text-gray-500 mt-1">Based on historical data</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Peak Festival Visitors</h4>
          <p className="text-2xl font-bold text-gray-800">7,500</p>
          <p className="text-xs text-gray-500 mt-1">During major festivals</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Optimal Visit Duration</h4>
          <p className="text-2xl font-bold text-gray-800">2-3 hrs</p>
          <p className="text-xs text-gray-500 mt-1">Recommended time</p>
        </div>
      </div>
    </div>
  );
};

export default Predict;
