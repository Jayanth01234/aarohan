import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, Play, Download, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function EmergencySimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [evacuationTime, setEvacuationTime] = useState(0);

  const runSimulation = () => {
    setIsSimulating(true);
    toast.info('Running emergency evacuation simulation...');
    
    // Simulate evacuation timing
    let time = 0;
    const interval = setInterval(() => {
      time += 0.5;
      setEvacuationTime(time);
      if (time >= 8.5) {
        clearInterval(interval);
        setIsSimulating(false);
        toast.success('Evacuation simulation complete: All visitors safely evacuated');
      }
    }, 100);
  };

  const evacuationRoutes = [
    { id: 1, name: 'Route A - North Exit', capacity: 800, time: '6 mins', status: 'optimal' },
    { id: 2, name: 'Route B - East Exit', capacity: 600, time: '7 mins', status: 'good' },
    { id: 3, name: 'Route C - South Exit', capacity: 900, time: '5 mins', status: 'optimal' },
    { id: 4, name: 'Route D - Emergency West', capacity: 1200, time: '4 mins', status: 'optimal' },
  ];

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h2>Emergency Evacuation Simulator</h2>
        </div>
        <p className="text-muted-foreground">AI-powered emergency response planning and evacuation time calculation</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-red-200 dark:border-red-800">
          <p className="text-sm text-muted-foreground">Current Occupancy</p>
          <p className="text-3xl mt-1">4,567</p>
          <p className="text-xs text-muted-foreground mt-1">visitors on-site</p>
        </Card>

        <Card className="p-4 border-orange-200 dark:border-orange-800">
          <p className="text-sm text-muted-foreground">Total Exit Capacity</p>
          <p className="text-3xl mt-1">3,500</p>
          <p className="text-xs text-muted-foreground mt-1">people/minute</p>
        </Card>

        <Card className="p-4 border-green-200 dark:border-green-800">
          <p className="text-sm text-muted-foreground">Est. Evacuation Time</p>
          <p className="text-3xl mt-1">8.5 min</p>
          <Badge variant="default" className="mt-1">Safe</Badge>
        </Card>

        <Card className="p-4 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-muted-foreground">Active Routes</p>
          <p className="text-3xl mt-1">4/6</p>
          <p className="text-xs text-muted-foreground mt-1">emergency exits</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3>Evacuation Simulation</h3>
            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              variant={isSimulating ? 'secondary' : 'destructive'}
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">Evacuation Progress</p>
              <p className="text-4xl">{evacuationTime.toFixed(1)} min</p>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-red-600 to-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((evacuationTime / 8.5) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Start</span>
              <span>Complete (8.5 min)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <span className="text-sm">Stage 1: Alert broadcast</span>
              <Badge variant={evacuationTime >= 0.5 ? 'default' : 'secondary'}>
                {evacuationTime >= 0.5 ? 'Complete' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <span className="text-sm">Stage 2: Open all emergency exits</span>
              <Badge variant={evacuationTime >= 1.5 ? 'default' : 'secondary'}>
                {evacuationTime >= 1.5 ? 'Complete' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <span className="text-sm">Stage 3: Guided evacuation begins</span>
              <Badge variant={evacuationTime >= 3.0 ? 'default' : 'secondary'}>
                {evacuationTime >= 3.0 ? 'Complete' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <span className="text-sm">Stage 4: Final sweep & verification</span>
              <Badge variant={evacuationTime >= 8.5 ? 'default' : 'secondary'}>
                {evacuationTime >= 8.5 ? 'Complete' : 'Pending'}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <h3 className="mb-3 text-red-900 dark:text-red-100">Emergency Actions</h3>
            <div className="space-y-2">
              <Button variant="destructive" className="w-full justify-start" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Activate Emergency Protocol
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Broadcast Alert
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Evacuation Plan
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-3">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nearest Hospital</span>
                <span>2.3 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fire Station</span>
                <span>1.8 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Police Station</span>
                <span>1.2 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ambulances</span>
                <span>3 on-site</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-3">Safety Score</h3>
            <div className="text-center">
              <p className="text-5xl mb-2">94</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
              <Badge variant="default" className="mt-2">Excellent</Badge>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Evacuation Routes Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          {evacuationRoutes.map(route => (
            <div key={route.id} className="border border-border rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <h4>{route.name}</h4>
                <Badge variant={route.status === 'optimal' ? 'default' : 'secondary'}>
                  {route.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="mt-1">{route.capacity} people</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Time</p>
                  <p className="mt-1">{route.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mt-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <h3 className="mb-2">AI-Powered Recommendations</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">⚠️</span>
            <span>During peak hours (4-6 PM), evacuation time increases to 12 minutes. Consider visitor caps.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Route D (Emergency West) is the fastest exit with 4-minute clearance time.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">💡</span>
            <span>Conduct monthly evacuation drills to maintain 8.5-minute target time.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
