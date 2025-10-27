import React from 'react';

const getStatus = (count, limit) => {
  if (count >= limit) return { color: 'bg-red-500', text: 'Overcrowded', pulse: true };
  if (count >= Math.floor(0.6 * limit)) return { color: 'bg-orange-400', text: 'Moderate', pulse: false };
  return { color: 'bg-green-500', text: 'Safe', pulse: false };
};

const ZoneCard = ({ name, count, limit = 150 }) => {
  const status = getStatus(count, limit);
  return (
    <div className={`rounded-lg shadow p-5 bg-white transition ${status.pulse ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className={`inline-block w-3 h-3 rounded-full ${status.color}`}></span>
      </div>
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-sm text-gray-600 mt-1">Status: {status.text}</div>
    </div>
  );
};

export default ZoneCard;
