import React, { useEffect, useMemo, useRef, useState } from 'react';
import ZoneCard from '../components/ZoneCard';

const SAFE_LIMIT = 150;

const initialZones = [
  { id: 'entry', name: 'Entry', count: 80 },
  { id: 'mainHall', name: 'Main Hall', count: 120 },
  { id: 'exit', name: 'Exit', count: 60 },
  { id: 'parking', name: 'Parking', count: 40 },
];

const Simulator = () => {
  const [zones, setZones] = useState(initialZones);
  const [festivalMode, setFestivalMode] = useState(false);
  const [gatesOpen, setGatesOpen] = useState({ entry: true, mainHall: true, exit: true, parking: true });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [redirectTarget, setRedirectTarget] = useState('mainHall');
  const beepRef = useRef(null);

  useEffect(() => {
    let ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      beepRef.current = { ctx, osc, gain };
    } catch {}
    return () => {
      try { beepRef.current?.osc?.stop(); beepRef.current?.ctx?.close(); } catch {}
    };
  }, []);

  const overcrowded = useMemo(() => zones.some(z => z.count >= SAFE_LIMIT), [zones]);

  const playBeep = () => {
    const b = beepRef.current;
    if (!b) return;
    const t = b.ctx.currentTime;
    b.gain.gain.cancelScheduledValues(t);
    b.gain.gain.setValueAtTime(0.0001, t);
    b.gain.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
    b.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setZones(prev => {
        const mult = festivalMode ? 1.8 : 1.0;
        const next = prev.map(z => {
          const gateFactor = gatesOpen[z.id] ? 1 : 0.3;
          const delta = Math.floor((Math.random() * 16 - 8) * mult * gateFactor);
          const newCount = Math.max(0, z.count + delta);
          return { ...z, count: newCount };
        });
        return next;
      });
      setLastUpdated(new Date());
    }, 3000);
    return () => clearInterval(id);
  }, [festivalMode, gatesOpen]);

  useEffect(() => {
    const entry = { time: new Date().toISOString(), zones: Object.fromEntries(zones.map(z => [z.id, z.count])) };
    setLogs(l => [...l.slice(-199), entry]);
    if (overcrowded) playBeep();
  }, [zones]);

  const toggleGate = (id) => setGatesOpen(s => ({ ...s, [id]: !s[id] }));

  const redirectSome = () => {
    setZones(prev => {
      const srcIdx = prev.findIndex(z => z.id === 'mainHall');
      const dstIdx = prev.findIndex(z => z.id === redirectTarget);
      if (srcIdx === -1 || dstIdx === -1 || srcIdx === dstIdx) return prev;
      const shift = Math.min(20, prev[srcIdx].count);
      const next = prev.map(z => ({ ...z }));
      next[srcIdx].count -= shift;
      next[dstIdx].count += shift;
      return next;
    });
  };

  const exportCSV = () => {
    const header = ['time','entry','mainHall','exit','parking'];
    const rows = logs.map(r => [r.time, r.zones.entry ?? '', r.zones.mainHall ?? '', r.zones.exit ?? '', r.zones.parking ?? '']);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crowd_logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`mb-6 p-4 rounded ${overcrowded ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{overcrowded ? 'Alert: Overcrowding detected' : 'All zones within safe limits'}</div>
          <div className="text-sm">Last updated: {lastUpdated.toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map(z => (
          <ZoneCard key={z.id} name={z.name} count={z.count} limit={SAFE_LIMIT} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Controls</div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={festivalMode} onChange={e => setFestivalMode(e.target.checked)} />
              Festival/Weekend mode
            </label>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {zones.map(z => (
                <button key={z.id} onClick={() => toggleGate(z.id)} className={`px-3 py-2 rounded border text-sm ${gatesOpen[z.id] ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  {z.name} {gatesOpen[z.id] ? 'Open' : 'Closed'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select value={redirectTarget} onChange={e => setRedirectTarget(e.target.value)} className="border rounded px-2 py-2">
                <option value="entry">Entry</option>
                <option value="mainHall">Main Hall</option>
                <option value="exit">Exit</option>
                <option value="parking">Parking</option>
              </select>
              <button onClick={redirectSome} className="px-3 py-2 rounded bg-blue-600 text-white">Redirect 20 from Main Hall →</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Data Log</div>
            <button onClick={exportCSV} className="px-3 py-2 rounded bg-indigo-600 text-white text-sm">Export CSV</button>
          </div>
          <div className="max-h-64 overflow-auto text-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-1 pr-4">Time</th>
                  <th className="py-1 pr-4">Entry</th>
                  <th className="py-1 pr-4">Main Hall</th>
                  <th className="py-1 pr-4">Exit</th>
                  <th className="py-1 pr-4">Parking</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice().reverse().map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1 pr-4">{new Date(r.time).toLocaleTimeString()}</td>
                    <td className="py-1 pr-4">{r.zones.entry ?? ''}</td>
                    <td className="py-1 pr-4">{r.zones.mainHall ?? ''}</td>
                    <td className="py-1 pr-4">{r.zones.exit ?? ''}</td>
                    <td className="py-1 pr-4">{r.zones.parking ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
