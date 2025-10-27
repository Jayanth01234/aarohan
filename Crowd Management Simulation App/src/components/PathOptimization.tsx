import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Route, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function PathOptimization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw zones
    const zones = [
      { name: 'Entrance', x: 50, y: 50, width: 100, height: 60 },
      { name: 'Sanctum', x: 350, y: 250, width: 150, height: 150 },
      { name: 'Courtyard', x: 150, y: 150, width: 250, height: 100 },
      { name: 'Exit', x: 600, y: 450, width: 80, height: 50 },
    ];

    zones.forEach(zone => {
      ctx.fillStyle = '#e0e7ff';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
      ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
      ctx.fillStyle = '#000';
      ctx.font = '14px sans-serif';
      ctx.fillText(zone.name, zone.x + 10, zone.y + 30);
    });

    // Draw paths
    const paths = [
      { 
        name: 'Current Path',
        points: [{ x: 100, y: 80 }, { x: 200, y: 180 }, { x: 420, y: 320 }, { x: 640, y: 475 }],
        color: '#ef4444',
        congestion: 'high'
      },
      {
        name: 'Optimized Path A',
        points: [{ x: 100, y: 80 }, { x: 275, y: 200 }, { x: 475, y: 325 }, { x: 640, y: 475 }],
        color: '#10b981',
        congestion: 'low'
      },
      {
        name: 'Alternative Path B',
        points: [{ x: 100, y: 80 }, { x: 180, y: 150 }, { x: 380, y: 280 }, { x: 640, y: 475 }],
        color: '#f59e0b',
        congestion: 'medium'
      }
    ];

    paths.forEach((path, idx) => {
      ctx.strokeStyle = selectedPath === idx || selectedPath === null ? path.color : path.color + '40';
      ctx.lineWidth = selectedPath === idx ? 4 : 2;
      ctx.setLineDash(idx === 0 ? [10, 5] : []);
      
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      path.points.forEach((point, i) => {
        if (i > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // Draw path markers
      path.points.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = path.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    ctx.setLineDash([]);
  }, [selectedPath]);

  const applyOptimization = () => {
    toast.success('Path optimization applied! One-way flow activated on Optimized Path A');
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2>Path Flow Optimization</h2>
        <p className="text-muted-foreground">AI-suggested routes and one-way lane recommendations</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Efficiency</p>
              <p className="text-3xl mt-1">68%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-red-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Optimized Efficiency</p>
              <p className="text-3xl mt-1">92%</p>
              <p className="text-xs text-green-600 mt-1">+24% improvement</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Congestion Points</p>
              <p className="text-3xl mt-1">3 → 0</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-600 opacity-20" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            <h3 className="mb-4">Path Visualization</h3>
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={applyOptimization}>
                <Route className="w-4 h-4 mr-2" />
                Apply Optimization
              </Button>
              <Button variant="outline">Simulate Flow</Button>
              <Button variant="outline">Export Route Map</Button>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="mb-4">Path Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Path</th>
                    <th className="text-left py-2">Distance</th>
                    <th className="text-left py-2">Avg. Time</th>
                    <th className="text-left py-2">Congestion</th>
                    <th className="text-left py-2">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        Current Path
                      </div>
                    </td>
                    <td>245m</td>
                    <td>12 min</td>
                    <td><Badge variant="destructive">High</Badge></td>
                    <td>300/min</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        Optimized Path A
                      </div>
                    </td>
                    <td>268m</td>
                    <td>8 min</td>
                    <td><Badge variant="default">Low</Badge></td>
                    <td>550/min</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        Alternative Path B
                      </div>
                    </td>
                    <td>252m</td>
                    <td>10 min</td>
                    <td><Badge variant="secondary">Medium</Badge></td>
                    <td>420/min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Path Selection</h3>
            <div className="space-y-2">
              <Button
                variant={selectedPath === 0 ? 'default' : 'outline'}
                className="w-full justify-start"
                size="sm"
                onClick={() => setSelectedPath(selectedPath === 0 ? null : 0)}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                Current Path
              </Button>
              <Button
                variant={selectedPath === 1 ? 'default' : 'outline'}
                className="w-full justify-start"
                size="sm"
                onClick={() => setSelectedPath(selectedPath === 1 ? null : 1)}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                Optimized Path A
              </Button>
              <Button
                variant={selectedPath === 2 ? 'default' : 'outline'}
                className="w-full justify-start"
                size="sm"
                onClick={() => setSelectedPath(selectedPath === 2 ? null : 2)}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                Alternative Path B
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <h3 className="mb-3">AI Recommendation</h3>
            <div className="space-y-3 text-sm">
              <p className="text-green-900 dark:text-green-100">
                <CheckCircle className="inline w-4 h-4 mr-1" />
                Switch to <strong>Optimized Path A</strong>
              </p>
              <p className="text-muted-foreground">
                Benefits:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>33% faster flow</li>
                <li>83% more capacity</li>
                <li>Eliminates bottlenecks</li>
                <li>Better visitor distribution</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-3">One-Way Lane Suggestions</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="text-blue-900 dark:text-blue-100">
                  📍 Courtyard → Sanctum<br />
                  <span className="text-xs text-muted-foreground">Activate during peak hours</span>
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="text-blue-900 dark:text-blue-100">
                  📍 Sanctum → Exit<br />
                  <span className="text-xs text-muted-foreground">Post-darshan flow</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-3">Flow Metrics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Throughput</span>
                <span>550 people/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Speed</span>
                <span>1.2 m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wait Reduction</span>
                <span className="text-green-600">-45%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
