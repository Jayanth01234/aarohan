import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WEATHER_CONDITIONS = {
  sunny: {
    label: '☀️ Sunny',
    color: 'rgb(255, 159, 64)', // Orange
    data: [60, 75, 85, 95, 100, 98, 90, 85, 88, 92, 85, 70]
  },
  cloudy: {
    label: '☁️ Cloudy',
    color: 'rgb(54, 162, 235)', // Blue
    data: [50, 65, 80, 90, 95, 90, 85, 80, 82, 85, 80, 65]
  },
  rainy: {
    label: '🌧️ Rainy',
    color: 'rgb(75, 192, 192)', // Teal
    data: [30, 45, 60, 75, 85, 80, 70, 65, 68, 72, 65, 50]
  },
  stormy: {
    label: '⛈️ Stormy',
    color: 'rgb(153, 102, 255)', // Purple
    data: [20, 30, 45, 60, 70, 65, 55, 50, 52, 58, 50, 35]
  }
};

const PredictionChart = ({ onTimeSelect, valuesOverride }) => {
  const [selectedWeather, setSelectedWeather] = useState('sunny');
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 6}:00`);
  
  // Use override values if provided, otherwise use weather-based data
  const values = Array.isArray(valuesOverride) && valuesOverride.length === hours.length
    ? valuesOverride
    : WEATHER_CONDITIONS[selectedWeather].data;

  const data = {
    labels: hours,
    datasets: [
      {
        label: WEATHER_CONDITIONS[selectedWeather].label,
        data: values,
        borderColor: WEATHER_CONDITIONS[selectedWeather].color,
        backgroundColor: `${WEATHER_CONDITIONS[selectedWeather].color}33`, // Add transparency
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Predicted Crowd Levels by Weather Condition',
        padding: {
          bottom: 10
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 120,
        ticks: {
          stepSize: 10,
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Crowd Density (%)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: true
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        onTimeSelect(hours[index]);
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Weather Condition:</h3>
        <div className="flex space-x-2">
          {Object.entries(WEATHER_CONDITIONS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSelectedWeather(key)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedWeather === key
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[400px] w-full p-4 bg-white rounded-lg shadow-sm border">
        <Line data={data} options={options} />
      </div>
      
      <p className="text-sm text-gray-600 mt-2 text-center">
        Click on the graph to select a time slot. Crowd predictions vary based on weather conditions.
      </p>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Note:</span> Crowd levels are typically {
            {
              sunny: 'higher on sunny days',
              cloudy: 'moderate on cloudy days',
              rainy: 'lower on rainy days',
              stormy: 'significantly lower during storms'
            }[selectedWeather]
          }. Adjust your visit time accordingly.
        </p>
      </div>
    </div>
  );
};

export default PredictionChart;