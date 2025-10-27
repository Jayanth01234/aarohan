import React, { useEffect, useMemo, useRef, useState } from 'react';
import ZoneCard from '../components/ZoneCard';

const SAFE_LIMIT = 150; // default for non-mainHall zones
const MAIN_HALL_CAPACITY = 300;

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
  // Deterministic flow rates (people per tick)
  const [entryRate, setEntryRate] = useState(30);
  const [exitRate, setExitRate] = useState(10);
  const [parkingEvacRate, setParkingEvacRate] = useState(5);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [redirectTarget, setRedirectTarget] = useState('mainHall');
  const [audioCtx, setAudioCtx] = useState(null);

  // Initialize AudioContext only after a user gesture
  const enableSound = async () => {
    try {
      let ctx = audioCtx;
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      setAudioCtx(ctx);
    } catch {}
  };

  const overcrowded = useMemo(() => zones.some(z => z.count >= SAFE_LIMIT), [zones]);

  const playBeep = () => {
    if (!audioCtx) return; // require user gesture to enable
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    const t = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.stop(t + 0.3);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setZones(prev => {
        const mult = festivalMode ? 1.8 : 1.0;
        const entryFlow = Math.max(0, Math.round((Number(entryRate) || 0) * mult * (gatesOpen.entry ? 1 : 0.3)));
        const exitFlowRequested = Math.max(0, Math.round((Number(exitRate) || 0) * mult * (gatesOpen.exit ? 1 : 0.3)));
        const parkingEvac = Math.max(0, Math.round((Number(parkingEvacRate) || 0) * mult * (gatesOpen.parking ? 1 : 0.3)));

        // Clone current counts
        const current = Object.fromEntries(prev.map(z => [z.id, z.count]));
        // Entry: show current flow in Entry zone (not accumulated)
        let entryDisplay = entryFlow;

        // Main Hall: add entry, remove exit
        const possibleExit = Math.min(exitFlowRequested, current.mainHall);
        let newMainHall = current.mainHall + entryFlow - possibleExit;
        newMainHall = Math.max(0, Math.min(MAIN_HALL_CAPACITY, newMainHall));

        // Exit: show current flow that actually exited
        const exitDisplay = possibleExit;

        // Parking: add exited people, then evacuate
        let newParking = current.parking + exitDisplay;
        const actualEvac = Math.min(parkingEvac, newParking);
        newParking -= actualEvac;

        // Build next state
        const next = prev.map(z => {
          if (z.id === 'entry') return { ...z, count: entryDisplay };
          if (z.id === 'mainHall') return { ...z, count: newMainHall };
          if (z.id === 'exit') return { ...z, count: exitDisplay };
          if (z.id === 'parking') return { ...z, count: newParking };
          return z;
        });

        return next;
      });
      setLastUpdated(new Date());
    }, 3000);
    return () => clearInterval(id);
  }, [festivalMode, gatesOpen, entryRate, exitRate, parkingEvacRate]);

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
          <ZoneCard
            key={z.id}
            name={z.name}
            count={z.count}
            limit={z.id === 'mainHall' ? MAIN_HALL_CAPACITY : SAFE_LIMIT}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Controls</div>
            <div className="flex items-center gap-3">
              {!audioCtx || audioCtx.state !== 'running' ? (
                <button onClick={enableSound} className="px-3 py-2 rounded bg-amber-500 text-white text-sm">Enable Sound</button>
              ) : null}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={festivalMode} onChange={e => setFestivalMode(e.target.checked)} />
                Festival/Weekend mode
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {zones.map(z => (
                <button key={z.id} onClick={() => toggleGate(z.id)} className={`px-3 py-2 rounded border text-sm ${gatesOpen[z.id] ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  {z.name} {gatesOpen[z.id] ? 'Open' : 'Closed'}
                </button>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Flow rates (people per tick)</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex flex-col text-sm">
                  <span className="mb-1">Entry rate → Main Hall</span>
                  <input type="number" className="border rounded px-2 py-1" value={entryRate}
                    onChange={(e) => setEntryRate(Number(e.target.value))} />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1">Exit rate ← Main Hall</span>
                  <input type="number" className="border rounded px-2 py-1" value={exitRate}
                    onChange={(e) => setExitRate(Number(e.target.value))} />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1">Parking evacuation</span>
                  <input type="number" className="border rounded px-2 py-1" value={parkingEvacRate}
                    onChange={(e) => setParkingEvacRate(Number(e.target.value))} />
                </label>
              </div>
              <div className="text-xs text-gray-500 mt-2">Gates affect effective flow: Open = 100%, Closed = 30%. Festival mode multiplies flows.</div>
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
