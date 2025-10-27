import React, { useState, useEffect } from 'react';
import CrowdMap from '../components/CrowdMap';
import CrowdMetrics from '../components/CrowdMetrics';
import AlertPanel from '../components/AlertPanel';

const AdminDashboard = () => {
  const [crowdData, setCrowdData] = useState({
    totalVisitors: 0,
    zones: [],
    alerts: []
  });

  useEffect(() => {
    // TODO: Connect to Socket.IO for real-time updates
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Temple Crowd Management Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Live Crowd Map</h2>
          <CrowdMap />
        </div>
        
        <div className="space-y-8">
          <CrowdMetrics data={crowdData} />
          <AlertPanel alerts={crowdData.alerts} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;