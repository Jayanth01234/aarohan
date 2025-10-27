import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';

interface Visitor {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  targetX: number;
  targetY: number;
}

export function CrowdSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [visitorCount, setVisitorCount] = useState(500);
  const [speed, setSpeed] = useState([1]);
  const visitorsRef = useRef<Visitor[]>([]);
  const animationRef = useRef<number>();

  // Temple layout zones
  const zones = [
    { name: 'Main Entrance', x: 50, y: 50, width: 100, height: 60, color: '#4ade80' },
    { name: 'Sanctum', x: 300, y: 200, width: 150, height: 150, color: '#fbbf24' },
    { name: 'Courtyard', x: 150, y: 150, width: 250, height: 100, color: '#60a5fa' },
    { name: 'Side Exit', x: 550, y: 400, width: 80, height: 50, color: '#4ade80' },
    { name: 'Rest Area', x: 100, y: 380, width: 120, height: 80, color: '#a78bfa' },
  ];

  const initializeVisitors = (count: number) => {
    const visitors: Visitor[] = [];
    for (let i = 0; i < count; i++) {
      visitors.push({
        id: i,
        x: Math.random() * 700,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
        targetX: Math.random() * 700,
        targetY: Math.random() * 500,
      });
    }
    visitorsRef.current = visitors;
  };

  useEffect(() => {
    initializeVisitors(visitorCount);
  }, [visitorCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw zones
      zones.forEach(zone => {
        ctx.fillStyle = zone.color + '20';
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = 2;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.fillText(zone.name, zone.x + 5, zone.y + 15);
      });

      // Update and draw visitors
      visitorsRef.current.forEach(visitor => {
        // Move towards target
        const dx = visitor.targetX - visitor.x;
        const dy = visitor.targetY - visitor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          // Reached target, set new target
          visitor.targetX = Math.random() * 700;
          visitor.targetY = Math.random() * 500;
        }

        visitor.vx = (dx / dist) * 0.5 * speed[0];
        visitor.vy = (dy / dist) * 0.5 * speed[0];
        
        visitor.x += visitor.vx;
        visitor.y += visitor.vy;

        // Boundary check
        if (visitor.x < 0 || visitor.x > canvas.width) visitor.vx *= -1;
        if (visitor.y < 0 || visitor.y > canvas.height) visitor.vy *= -1;

        // Draw visitor
        ctx.beginPath();
        ctx.arc(visitor.x, visitor.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = visitor.color;
        ctx.fill();
      });

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  const handleReset = () => {
    initializeVisitors(visitorCount);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2>3D Site Layout Simulation</h2>
        <p className="text-muted-foreground">Interactive temple map with real-time crowd movement</p>
      </div>

      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <div className="flex gap-2">
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Visitors: {visitorCount}</span>
          <input
            type="range"
            min="100"
            max="2000"
            value={visitorCount}
            onChange={(e) => setVisitorCount(Number(e.target.value))}
            className="w-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Speed: {speed[0].toFixed(1)}x</span>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            min={0.1}
            max={3}
            step={0.1}
            className="w-32"
          />
        </div>

        <Badge variant="outline">
          Live Count: {visitorsRef.current.length}
        </Badge>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full"
        />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {zones.map((zone, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: zone.color }} />
            <span>{zone.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
