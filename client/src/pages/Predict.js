import React, { useMemo, useState } from 'react';
import PredictionChart from '../components/PredictionChart';

const baseProfile = [30, 45, 60, 80, 90, 85, 70, 65, 75, 80, 70, 50];

const scaleProfile = (arr, factor) => arr.map(v => Math.round(v * factor));

const Predict = () => {
  const [mode, setMode] = useState('normal'); // normal | weekend | festival

  const data = useMemo(() => {
    if (mode === 'festival') return scaleProfile(baseProfile, 1.8);
    if (mode === 'weekend') return scaleProfile(baseProfile, 1.3);
    return baseProfile;
  }, [mode]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Predictive Analysis</h1>
        <div className="flex gap-2">
          <button onClick={() => setMode('normal')} className={`px-3 py-2 rounded text-sm ${mode==='normal'?'bg-blue-600 text-white':'bg-gray-200'}`}>Normal</button>
          <button onClick={() => setMode('weekend')} className={`px-3 py-2 rounded text-sm ${mode==='weekend'?'bg-blue-600 text-white':'bg-gray-200'}`}>Weekend</button>
          <button onClick={() => setMode('festival')} className={`px-3 py-2 rounded text-sm ${mode==='festival'?'bg-blue-600 text-white':'bg-gray-200'}`}>Festival</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <PredictionChart onTimeSelect={() => {}} valuesOverride={data} />
      </div>
    </div>
  );
};

export default Predict;
