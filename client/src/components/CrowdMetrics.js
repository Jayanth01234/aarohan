import React from 'react';

const CrowdMetrics = ({ data }) => {
  const { totalVisitors, zones } = data;

  const getStatusColor = (current, capacity) => {
    const ratio = current / capacity;
    if (ratio < 0.5) return 'text-green-500';
    if (ratio < 0.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Current Metrics</h2>
      
      <div className="mb-4">
        <span className="text-gray-600">Total Visitors:</span>
        <span className="ml-2 text-2xl font-bold">{totalVisitors}</span>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Zone Occupancy</h3>
        {zones.map((zone) => (
          <div key={zone.id} className="flex justify-between items-center">
            <span className="text-gray-600">{zone.name}</span>
            <div className="text-right">
              <span className={getStatusColor(zone.current, zone.capacity)}>
                {zone.current}
              </span>
              <span className="text-gray-400 ml-1">/ {zone.capacity}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Capacity indicators */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Safe</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Crowded</span>
        </div>
      </div>
    </div>
  );
};

export default CrowdMetrics;