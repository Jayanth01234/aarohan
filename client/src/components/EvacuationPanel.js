import React, { useMemo, useState } from 'react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const EvacuationPanel = ({ totalPeople = 0, zones = [], predictedPeak = null }) => {
  const [flowRatePerGate, setFlowRatePerGate] = useState(3); // people per second per gate
  const [openGates, setOpenGates] = useState(2);
  const [targetMinutes, setTargetMinutes] = useState(10);
  const [staffPerPeople, setStaffPerPeople] = useState(50); // 1 staff per N people

  const peakPeople = useMemo(() => {
    const p = Number(predictedPeak);
    const base = Number(totalPeople) || 0;
    if (!isNaN(p) && p > 0) return Math.max(base, Math.round(p));
    return base;
  }, [predictedPeak, totalPeople]);

  const calculations = useMemo(() => {
    const gates = clamp(Number(openGates) || 0, 0, 50);
    const rate = Math.max(0, Number(flowRatePerGate) || 0);
    const targetSec = Math.max(1, Math.round((Number(targetMinutes) || 0) * 60));
    const capacityPerSec = gates * rate;

    const timeToEvacuateSec = capacityPerSec > 0 ? Math.ceil(peakPeople / capacityPerSec) : Infinity;
    const requiredGatesForTarget = rate > 0 ? Math.ceil(peakPeople / (rate * targetSec)) : Infinity;

    const staffByZone = zones.map((z) => {
      const people = Number(z.current) || 0;
      const staffNeeded = staffPerPeople > 0 ? Math.ceil(people / staffPerPeople) : 0;
      return { id: z.id, name: z.name, staffNeeded, people, capacity: z.capacity };
    });

    const totalStaffNeeded = staffByZone.reduce((sum, z) => sum + z.staffNeeded, 0);

    return {
      timeToEvacuateSec,
      requiredGatesForTarget,
      capacityPerSec,
      targetSec,
      staffByZone,
      totalStaffNeeded,
    };
  }, [openGates, flowRatePerGate, targetMinutes, peakPeople, zones, staffPerPeople]);

  const recText = useMemo(() => {
    if (!isFinite(calculations.timeToEvacuateSec)) {
      return 'Open at least one gate and set a positive flow rate.';
    }
    const minutes = Math.floor(calculations.timeToEvacuateSec / 60);
    const seconds = calculations.timeToEvacuateSec % 60;

    const gatesForTarget = calculations.requiredGatesForTarget;
    if (!isFinite(gatesForTarget)) return 'Increase flow rate or open gates to meet target.';

    if (gatesForTarget <= openGates) {
      return `Current plan evacuates in about ${minutes}m ${seconds}s (<= target).`;
    }
    return `Open ~${gatesForTarget} gates to meet the target of ${targetMinutes}m.`;
  }, [calculations, openGates, targetMinutes]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Evacuation & Resource Suggestions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm text-gray-600">People to evacuate</div>
          <div className="text-2xl font-semibold">{peakPeople}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Current gates open</div>
          <input
            type="number"
            min={0}
            max={50}
            value={openGates}
            onChange={(e) => setOpenGates(Number(e.target.value))}
            className="mt-1 w-24 p-2 border rounded"
          />
        </div>
        <div>
          <div className="text-sm text-gray-600">Flow rate per gate (people/sec)</div>
          <input
            type="number"
            min={0}
            step="0.1"
            value={flowRatePerGate}
            onChange={(e) => setFlowRatePerGate(Number(e.target.value))}
            className="mt-1 w-28 p-2 border rounded"
          />
        </div>
        <div>
          <div className="text-sm text-gray-600">Target evacuation time (minutes)</div>
          <input
            type="number"
            min={1}
            max={240}
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(Number(e.target.value))}
            className="mt-1 w-28 p-2 border rounded"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded border">
          <div className="text-sm text-gray-600">Capacity</div>
          <div className="text-xl font-semibold">{calculations.capacityPerSec} ppl/s</div>
        </div>
        <div className="p-4 bg-gray-50 rounded border">
          <div className="text-sm text-gray-600">Time to evacuate</div>
          <div className="text-xl font-semibold">
            {isFinite(calculations.timeToEvacuateSec)
              ? `${Math.floor(calculations.timeToEvacuateSec / 60)}m ${calculations.timeToEvacuateSec % 60}s`
              : 'N/A'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded border">
          <div className="text-sm text-gray-600">Gates needed for target</div>
          <div className="text-xl font-semibold">
            {isFinite(calculations.requiredGatesForTarget) ? calculations.requiredGatesForTarget : 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-800">{recText}</div>

      <div className="mt-8">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold">Staff suggestions</h3>
          <div className="text-sm text-gray-600">(1 staff per</div>
          <input
            type="number"
            min={1}
            value={staffPerPeople}
            onChange={(e) => setStaffPerPeople(Number(e.target.value))}
            className="w-20 p-1 border rounded"
          />
          <div className="text-sm text-gray-600">people)</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="py-2 px-2">Zone</th>
                <th className="py-2 px-2">People</th>
                <th className="py-2 px-2">Capacity</th>
                <th className="py-2 px-2">Staff Needed</th>
              </tr>
            </thead>
            <tbody>
              {calculations.staffByZone.map((z) => (
                <tr key={z.id} className="border-t">
                  <td className="py-2 px-2">{z.name}</td>
                  <td className="py-2 px-2">{z.people}</td>
                  <td className="py-2 px-2">{z.capacity ?? '-'}</td>
                  <td className="py-2 px-2 font-medium">{z.staffNeeded}</td>
                </tr>
              ))}
              <tr className="border-t bg-gray-50">
                <td className="py-2 px-2 font-medium">Total</td>
                <td className="py-2 px-2">{zones.reduce((s, z) => s + (Number(z.current) || 0), 0)}</td>
                <td className="py-2 px-2">-</td>
                <td className="py-2 px-2 font-bold">{calculations.totalStaffNeeded}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvacuationPanel;
