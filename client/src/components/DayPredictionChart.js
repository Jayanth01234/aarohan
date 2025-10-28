import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { predictCrowdLevel, getDayType, getSpecialDayInfo, DAY_TYPES } from '../utils/specialDays';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DayPredictionChart = ({ selectedDate }) => {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Please select a date from the calendar to view predictions
      </div>
    );
  }
  
  // Generate hourly predictions for the selected date
  const hours = [];
  const predictions = [];
  
  for (let hour = 6; hour <= 18; hour++) {
    hours.push(`${hour}:00`);
    predictions.push(predictCrowdLevel(selectedDate, hour));
  }
  
  const dayType = getDayType(selectedDate);
  const specialInfo = getSpecialDayInfo(selectedDate);
  const dayColor = DAY_TYPES[dayType].color;
  
  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Predicted Crowd Level',
        data: predictions,
        borderColor: dayColor,
        backgroundColor: `${dayColor}33`,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: dayColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Hourly Crowd Prediction - ${selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            let status = 'Low';
            if (value > 80) status = 'Very High';
            else if (value > 60) status = 'High';
            else if (value > 40) status = 'Moderate';
            
            return [
              `Crowd Level: ${value}%`,
              `Status: ${status}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Crowd Density (%)',
          font: {
            size: 13,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time of Day',
          font: {
            size: 13,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      }
    }
  };
  
  // Find peak hour
  const maxCrowd = Math.max(...predictions);
  const peakHourIndex = predictions.indexOf(maxCrowd);
  const peakHour = hours[peakHourIndex];
  
  // Find best time to visit (lowest crowd)
  const minCrowd = Math.min(...predictions);
  const bestHourIndex = predictions.indexOf(minCrowd);
  const bestHour = hours[bestHourIndex];
  
  // Debug logging
  console.log('Predictions:', predictions);
  console.log('Peak:', { hour: peakHour, crowd: maxCrowd });
  console.log('Best:', { hour: bestHour, crowd: minCrowd });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Day type badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="px-4 py-2 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: dayColor }}
          >
            {DAY_TYPES[dayType].label}
          </div>
          {specialInfo && (
            <div className="px-4 py-2 rounded-full bg-purple-100 text-purple-800 font-semibold text-sm">
              🎉 {specialInfo.name}
            </div>
          )}
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[400px] mb-6">
        <Line data={data} options={options} />
      </div>
      
      {/* Insights */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        {/* Peak time */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-red-900">Peak Time</h4>
          </div>
          <p className="text-red-700 text-sm">
            <span className="font-bold text-lg">{peakHour}</span> - Highest crowd expected ({maxCrowd}%)
          </p>
          <p className="text-red-600 text-xs mt-1">⚠️ Avoid visiting during this time</p>
        </div>
        
        {/* Best time */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-green-900">Best Time to Visit</h4>
          </div>
          <p className="text-green-700 text-sm">
            <span className="font-bold text-lg">{bestHour}</span> - Lowest crowd expected ({minCrowd}%)
          </p>
          <p className="text-green-600 text-xs mt-1">✓ Recommended visiting time</p>
        </div>
      </div>
      
      {/* Additional info for special days */}
      {specialInfo && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Special Day Notice</h4>
              <p className="text-yellow-800 text-sm">
                {specialInfo.name} typically sees {Math.round((specialInfo.crowdMultiplier - 1) * 100)}% more visitors than usual. 
                Plan accordingly and consider booking in advance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayPredictionChart;
