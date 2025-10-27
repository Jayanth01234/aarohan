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

const PredictionChart = ({ onTimeSelect, valuesOverride }) => {
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 6}:00`);
  
  const values = Array.isArray(valuesOverride) && valuesOverride.length === hours.length
    ? valuesOverride
    : [30, 45, 60, 80, 90, 85, 70, 65, 75, 80, 70, 50];

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Predicted Crowd Level',
        data: values,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Predicted Crowd Levels Today'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Crowd Density (%)'
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        onTimeSelect(hours[index]);
      }
    }
  };

  return (
    <div>
      <Line data={data} options={options} />
      <p className="text-sm text-gray-600 mt-2">Click on the graph to select a time slot</p>
    </div>
  );
};

export default PredictionChart;