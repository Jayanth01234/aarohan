import React, { useState } from 'react';
import { getDayType, getSpecialDayInfo, DAY_TYPES, formatDate } from '../utils/specialDays';

const PredictiveCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  const handleDayClick = (day) => {
    if (day) {
      const date = new Date(year, month, day);
      onDateSelect(date);
    }
  };
  
  const isSelectedDate = (day) => {
    if (!day || !selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };
  
  const getDayColor = (day) => {
    if (!day) return '';
    const date = new Date(year, month, day);
    const dayType = getDayType(date);
    return DAY_TYPES[dayType].color;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold">
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const date = new Date(year, month, day);
          const dayType = getDayType(date);
          const specialInfo = getSpecialDayInfo(date);
          const isSelected = isSelectedDate(day);
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={isPast}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium transition-all
                ${isPast ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
              style={{
                backgroundColor: isPast ? '#f3f4f6' : getDayColor(day) + '20',
                borderLeft: `4px solid ${getDayColor(day)}`
              }}
              title={specialInfo ? specialInfo.name : DAY_TYPES[dayType].label}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={isPast ? 'text-gray-400' : 'text-gray-800'}>{day}</span>
                {specialInfo && !isPast && (
                  <span className="text-xs mt-1">🎉</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Legend:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(DAY_TYPES).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Selected date info */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Selected: {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          {getSpecialDayInfo(selectedDate) && (
            <p className="text-sm text-blue-700 mt-1">
              🎉 {getSpecialDayInfo(selectedDate).name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictiveCalendar;
