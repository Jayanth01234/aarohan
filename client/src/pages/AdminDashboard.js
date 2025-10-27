import React, { useState, useEffect } from 'react';
import CrowdMap from '../components/CrowdMap';
import CrowdMetrics from '../components/CrowdMetrics';
import AlertPanel from '../components/AlertPanel';
import { connectSocket } from '../utils/socket';
import { socket } from '../utils/socket';

const AdminDashboard = () => {
  const [crowdData, setCrowdData] = useState({
    totalVisitors: 0,
    zones: [],
    alerts: []
  });

  const [cvResult, setCvResult] = useState(null);
  const [cvSeries, setCvSeries] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [seriesMode, setSeriesMode] = useState(false);

  useEffect(() => {
    // Connect to Socket.IO for real-time updates and alerts
    connectSocket();
    const onAlert = (payload) => {
      setCrowdData((prev) => ({
        ...prev,
        alerts: [
          { id: Date.now(), type: payload?.type || 'alert', severity: payload?.severity || 'info', message: 'Overcrowding detected', payload },
          ...prev.alerts,
        ].slice(0, 20),
      }));
    };
    socket.on('alert', onAlert);
    return () => {
      socket.off('alert', onAlert);
    };
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setCvResult(null);
  };

  const onUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append('image', file);
      const url = seriesMode ? 'http://localhost:5000/api/cv/count_series' : 'http://localhost:5000/api/cv/count';
      const res = await fetch(url, { method: 'POST', body: form });
      const data = await res.json();
      if (seriesMode) {
        setCvSeries(data);
        setCvResult(null);
      } else {
        setCvResult(data);
        setCvSeries(null);
      }
      if (!res.ok) throw new Error((data && data.error) || 'Upload failed');
    } catch (err) {
      setCvResult({ error: err.message || String(err) });
      setCvSeries(null);
    } finally {
      setUploading(false);
    }
  };

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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">CV Test</h2>
            <div className="flex flex-wrap items-center gap-3">
              <input type="file" accept="image/*,video/*" onChange={onFileChange} className="block" />
              <button
                onClick={onUpload}
                disabled={!file || uploading}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Analyze'}
              </button>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={seriesMode} onChange={e => setSeriesMode(e.target.checked)} />
                Per-second series (video)
              </label>
            </div>
            {cvResult && (
              <pre className="mt-4 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(cvResult, null, 2)}
              </pre>
            )}
            {cvSeries && (
              <div className="mt-4">
                <div className="text-sm text-gray-700 mb-2">Frames: {Array.isArray(cvSeries.frames) ? cvSeries.frames.length : 0}</div>
                <div className="max-h-64 overflow-auto bg-gray-50 rounded border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="py-1 px-2">t(s)</th>
                        <th className="py-1 px-2">persons</th>
                        <th className="py-1 px-2">density</th>
                        <th className="py-1 px-2">overcrowded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cvSeries.frames?.map((f, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-1 px-2">{f.t_seconds}</td>
                          <td className="py-1 px-2">{f.person_count}</td>
                          <td className="py-1 px-2">{f.density}</td>
                          <td className="py-1 px-2">{String(f.overcrowded)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;