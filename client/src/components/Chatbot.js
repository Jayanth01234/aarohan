import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connectSocket, subscribeToCrowdUpdates, unsubscribeToCrowdUpdates } from '../utils/socket';

const fmtPct = (n) => `${Math.round(n * 100)}%`;

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I can help with visit times, gate crowding, and Main Hall safety. Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const latestDataRef = useRef({ zones: [] });

  useEffect(() => {
    connectSocket();
    const onUpdate = (data) => {
      // Expect data like { zones: [{id,name,current,capacity}, ...] }
      if (data && Array.isArray(data.zones)) {
        latestDataRef.current = data;
      }
    };
    subscribeToCrowdUpdates(onUpdate);
    return () => {
      unsubscribeToCrowdUpdates();
    };
  }, []);

  const zonesIndex = useMemo(() => {
    const idx = {};
    for (const z of latestDataRef.current.zones || []) {
      idx[z.id] = z;
      if (z.name) idx[z.name.toLowerCase()] = z;
    }
    return idx;
  }, [messages]); // re-evaluate occasionally when messages change

  const getOccupancy = (zone) => {
    if (!zone) return 0;
    const cap = Number(zone.capacity) || 1;
    const cur = Number(zone.current) || 0;
    return Math.max(0, Math.min(1, cur / cap));
  };

  const bestTimeToVisit = () => {
    // Simple rule: if average occupancy < 0.4 now, "now" is good; otherwise suggest off-peak
    const zones = latestDataRef.current.zones || [];
    const avg = zones.length ? zones.reduce((s, z) => s + getOccupancy(z), 0) / zones.length : 0;
    if (avg < 0.4) {
      return `Now looks decent (${fmtPct(avg)} avg occupancy). Early morning (6–8 AM) and late evening (7–9 PM) are usually best.`;
    }
    return `Crowds are moderate/high right now (${fmtPct(avg)} avg). Try early morning (6–8 AM) or late evening (7–9 PM).`;
  };

  const lessCrowdedGate = () => {
    // Compare entry vs exit if present, else pick lowest occupancy zone as a proxy
    const entry = zonesIndex['entry'];
    const exit = zonesIndex['exit'];
    if (entry && exit) {
      const eOcc = getOccupancy(entry);
      const xOcc = getOccupancy(exit);
      const name = eOcc <= xOcc ? 'Entry' : 'Exit';
      const occ = eOcc <= xOcc ? eOcc : xOcc;
      return `${name} is less crowded right now at about ${fmtPct(occ)}.`;
    }
    const zones = latestDataRef.current.zones || [];
    if (!zones.length) return 'I do not have live gate data yet.';
    const sorted = zones.slice().sort((a, b) => getOccupancy(a) - getOccupancy(b));
    const z = sorted[0];
    return `${z.name || z.id} looks least crowded at about ${fmtPct(getOccupancy(z))}.`;
  };

  const isMainHallSafe = () => {
    const mh = zonesIndex['mainhall'] || zonesIndex['main hall'];
    if (!mh) return 'I do not have Main Hall data yet.';
    const occ = getOccupancy(mh);
    const safe = occ < 0.8; // 80% threshold
    return `Main Hall is ${safe ? 'within safe limits' : 'near capacity'} at ${fmtPct(occ)}.`;
  };

  const answer = (q) => {
    const text = q.toLowerCase();
    if (/(best|good).*(time).*(visit)/.test(text)) return bestTimeToVisit();
    if (/(which|what).*(gate).*(less|low).*(crowd)/.test(text) || /(gate).*(less|low).*(crowd)/.test(text)) return lessCrowdedGate();
    if (/(main\s*hall).*(safe|crowd|status)/.test(text)) return isMainHallSafe();
    // Fallback
    const zones = latestDataRef.current.zones || [];
    const summary = zones.map(z => `${z.name || z.id}: ${fmtPct(getOccupancy(z))}`).join(', ');
    return summary ? `Here is the current snapshot — ${summary}. You can ask me about best time, gates, or Main Hall safety.` : `You can ask: "When is the best time to visit?", "Which gate has less crowd?", or "Is Main Hall safe right now?"`;
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: 'user', text: trimmed };
    const botMsg = { role: 'bot', text: answer(trimmed) };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput('');
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 text-xl"
        aria-label="Open Chatbot"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold">Temple Assistant</div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-3 h-72 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'bot' ? 'text-gray-800' : 'text-gray-900 font-medium'}>
                {m.role === 'bot' ? '🤖 ' : '🧑 '} {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <input
              className="flex-1 border rounded px-2 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type your question..."
            />
            <button onClick={send} className="px-3 py-2 rounded bg-indigo-600 text-white text-sm">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
