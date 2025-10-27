import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export function HeatmapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [congestionLevel, setCongestionLevel] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient heatmap
    const drawHeatmap = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simulate heat zones with multiple hotspots
      const hotspots = [
        { x: 300, y: 200, intensity: 0.9, radius: 120 },
        { x: 150, y: 350, intensity: 0.6, radius: 80 },
        { x: 550, y: 150, intensity: 0.4, radius: 100 },
        { x: 450, y: 450, intensity: 0.7, radius: 90 },
      ];

      for (let y = 0; y < canvas.height; y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
          let totalIntensity = 0;

          hotspots.forEach(hotspot => {
            const distance = Math.sqrt(
              Math.pow(x - hotspot.x, 2) + Math.pow(y - hotspot.y, 2)
            );
            const intensity = Math.max(
              0,
              hotspot.intensity * (1 - distance / hotspot.radius)
            );
            totalIntensity += intensity;
          });

          totalIntensity = Math.min(1, totalIntensity);

          // Color mapping: green -> yellow -> orange -> red
          let r, g, b;
          if (totalIntensity < 0.25) {
            // Green to yellow
            r = Math.floor(totalIntensity * 4 * 255);
            g = 255;
            b = 0;
          } else if (totalIntensity < 0.5) {
            // Yellow to orange
            r = 255;
            g = Math.floor((1 - (totalIntensity - 0.25) * 4) * 255);
            b = 0;
          } else if (totalIntensity < 0.75) {
            // Orange to red
            r = 255;
            g = Math.floor((1 - (totalIntensity - 0.5) * 4) * 200);
            b = 0;
          } else {
            // Deep red
            r = 255;
            g = Math.floor((1 - (totalIntensity - 0.75) * 4) * 50);
            b = 0;
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${totalIntensity * 0.7})`;
          ctx.fillRect(x, y, 5, 5);
        }
      }

      // Draw zone boundaries
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(50, 50, 100, 60);
      ctx.strokeRect(300, 200, 150, 150);
      ctx.strokeRect(150, 150, 250, 100);
      ctx.strokeRect(550, 400, 80, 50);
      ctx.strokeRect(100, 380, 120, 80);
      ctx.setLineDash([]);

      // Add labels
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('SANCTUM', 320, 220);
      ctx.fillText('ENTRANCE', 60, 70);
      ctx.fillText('COURTYARD', 160, 170);
    };

    drawHeatmap();

    // Simulate real-time updates
    const interval = setInterval(() => {
      const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      setCongestionLevel(levels[Math.floor(Math.random() * 3)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2>Heatmap Visualization</h2>
        <p className="text-muted-foreground">Real-time crowd density mapping</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Status</p>
              <p className="text-2xl mt-1 capitalize">{congestionLevel}</p>
            </div>
            {congestionLevel === 'low' && <CheckCircle className="w-8 h-8 text-green-600" />}
            {congestionLevel === 'medium' && <AlertCircle className="w-8 h-8 text-yellow-600" />}
            {congestionLevel === 'high' && <AlertTriangle className="w-8 h-8 text-red-600" />}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Peak Density Zone</p>
          <p className="text-2xl mt-1">Sanctum Area</p>
          <Badge variant="destructive" className="mt-2">High Traffic</Badge>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Safe Capacity</p>
          <p className="text-2xl mt-1">78%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden border border-border mb-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm">Density Scale:</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-4 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600 rounded" />
            <span className="text-xs text-muted-foreground">Low → High</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm">Export Heatmap Data</Button>
      </div>
    </div>
  );
}
