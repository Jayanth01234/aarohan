import React, { useState, useEffect } from 'react';
import CrowdMap from '../components/CrowdMap';
import CrowdMetrics from '../components/CrowdMetrics';
import AlertPanel from '../components/AlertPanel';
import TimeSeriesChart from '../components/TimeSeriesChart';
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
  const [prediction, setPrediction] = useState(null);
  const [predictionTime, setPredictionTime] = useState(5); // Default prediction for next 5 seconds

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
      setPrediction(null); // Reset previous prediction
      const form = new FormData();
      form.append('image', file);
      const url = seriesMode ? 'http://localhost:5000/api/cv/count_series' : 'http://localhost:5000/api/cv/count';
      const res = await fetch(url, { method: 'POST', body: form });
      const data = await res.json();
      
      if (seriesMode) {
        // Ensure frames are sorted by time and have numeric values
        if (data.frames) {
          data.frames = data.frames.map(f => ({
            ...f,
            t_seconds: parseFloat(f.t_seconds) || 0,
            person_count: parseInt(f.person_count) || 0,
            density: parseFloat(f.density) || 0,
            overcrowded: Boolean(f.overcrowded)
          })).sort((a, b) => a.t_seconds - b.t_seconds);
        }
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
  
  // Simple linear regression prediction
  const predictCrowd = () => {
    if (!cvSeries?.frames || cvSeries.frames.length < 2) return;
    
    const frames = cvSeries.frames;
    const n = frames.length;
    
    // Calculate linear regression coefficients (y = a + b*x)
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    frames.forEach((frame, i) => {
      const x = frame.t_seconds;
      const y = frame.person_count;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });
    
    const xMean = sumX / n;
    const yMean = sumY / n;
    
    // Calculate slope (b) and intercept (a)
    const b = (sumXY - sumX * sumY / n) / (sumX2 - sumX * sumX / n);
    const a = yMean - b * xMean;
    
    // Predict for the next 'predictionTime' seconds
    const lastTime = frames[frames.length - 1].t_seconds;
    const predictTime = lastTime + predictionTime;
    const predictedCount = a + b * predictTime;
    
    // Determine trend
    const firstCount = frames[0].person_count;
    const lastCount = frames[frames.length - 1].person_count;
    const trend = lastCount > firstCount + 2 ? 'increasing' : 
                 lastCount < firstCount - 2 ? 'decreasing' : 'stable';
    
    // Add warning if approaching or exceeding capacity
    let warning = '';
    const avgCapacity = frames.reduce((sum, f) => sum + (f.density || 0), 0) / frames.length;
    const capacity = 100; // Default capacity threshold (adjust as needed)
    
    if (predictedCount > capacity * 0.9) {
      warning = `Warning: Predicted to exceed 90% of capacity (${capacity}) in ${predictionTime} seconds.`;
    } else if (trend === 'increasing' && avgCapacity > 0.7) {
      warning = 'Warning: Crowd is increasing and already at high density.';
    }
    
    setPrediction({
      predictedCount: Math.max(0, predictedCount), // Don't predict negative counts
      trend,
      warning,
      slope: b,
      intercept: a,
      rSquared: 0, // For a more complete solution, calculate R²
      predictedTime: predictTime
    });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 gradient-text">Temple Crowd Management Dashboard</h1>
        <p className="text-xl text-gray-600">Real-time monitoring and analytics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-modern">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🗺️</span>
            <h2 className="text-2xl font-bold text-gray-800">Live Crowd Map</h2>
          </div>
          <CrowdMap />
        </div>
        
        <div className="space-y-6">
          <CrowdMetrics data={crowdData} />
          <AlertPanel alerts={crowdData.alerts} />
          
          <div className="card-modern">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🔍</span>
              <h2 className="text-2xl font-bold text-gray-800">CV Analysis</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={onFileChange} 
                className="block" 
              />
              <button
                onClick={onUpload}
                disabled={!file || uploading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : '🔍 Analyze'}
              </button>
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={seriesMode} 
                  onChange={e => setSeriesMode(e.target.checked)} 
                />
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
                <div className="text-sm text-gray-700 mb-2">
                  Frames: {cvSeries.frames?.length || 0} | 
                  Duration: {cvSeries.frames?.length > 0 ? 
                    `${cvSeries.frames[cvSeries.frames.length - 1].t_seconds.toFixed(1)}s` : 'N/A'}
                </div>

                {/* Time Series Chart */}
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                  <TimeSeriesChart data={cvSeries} />

                  {/* Prediction Controls */}
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-2">Crowd Prediction</h3>
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Predict next (seconds):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={predictionTime}
                          onChange={(e) => setPredictionTime(Number(e.target.value))}
                          className="w-20 p-1 border rounded"
                        />
                      </div>
                      <button
                        onClick={predictCrowd}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={!cvSeries?.frames || cvSeries.frames.length < 2}
                      >
                        Predict
                      </button>
                    </div>

                    {prediction && (
                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <h4 className="font-medium text-blue-800">Prediction Results:</h4>
                        <p>
                          In {predictionTime} seconds, expected crowd: {prediction.predictedCount.toFixed(1)} people
                          {prediction.trend !== 'stable' && (
                            <span className={`ml-2 ${prediction.trend === 'increasing' ? 'text-red-600' : 'text-green-600'}`}>
                              (Trend: {prediction.trend})
                            </span>
                          )}
                        </p>
                        {prediction.warning && (
                          <p className="mt-2 text-yellow-700 font-medium">⚠️ {prediction.warning}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Table (Collapsible) */}
                <details className="mt-4">
                  <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                    View Raw Data
                  </summary>
                  <div className="mt-2 max-h-64 overflow-auto bg-gray-50 rounded border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left bg-gray-100">
                          <th className="py-1 px-2">Time (s)</th>
                          <th className="py-1 px-2">People</th>
                          <th className="py-1 px-2">Density</th>
                          <th className="py-1 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cvSeries.frames?.map((f, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="py-1 px-2">{f.t_seconds.toFixed(1)}</td>
                            <td className="py-1 px-2">{f.person_count}</td>
                            <td className="py-1 px-2">{(f.density * 100).toFixed(1)}%</td>
                            <td className="py-1 px-2">
                              <span className={`inline-block w-3 h-3 rounded-full mr-1 ${f.overcrowded ? 'bg-red-500' : 'bg-green-500'}`}></span>
                              {f.overcrowded ? 'Crowded' : 'Normal'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;