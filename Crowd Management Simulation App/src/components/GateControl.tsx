import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { DoorOpen, DoorClosed, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Gate {
  id: number;
  name: string;
  type: 'entry' | 'exit' | 'both';
  status: 'open' | 'closed';
  throughput: number;
  capacity: number;
  pressure: 'low' | 'medium' | 'high';
}

export function GateControl() {
  const [gates, setGates] = useState<Gate[]>([
    { id: 1, name: 'Main Entrance (North)', type: 'entry', status: 'open', throughput: 234, capacity: 500, pressure: 'medium' },
    { id: 2, name: 'Side Entrance (East)', type: 'entry', status: 'open', throughput: 156, capacity: 300, pressure: 'low' },
    { id: 3, name: 'VIP Gate', type: 'both', status: 'closed', throughput: 0, capacity: 100, pressure: 'low' },
    { id: 4, name: 'Main Exit (South)', type: 'exit', status: 'open', throughput: 189, capacity: 400, pressure: 'medium' },
    { id: 5, name: 'Emergency Exit (West)', type: 'exit', status: 'closed', throughput: 0, capacity: 600, pressure: 'low' },
    { id: 6, name: 'Courtyard Gate', type: 'both', status: 'open', throughput: 267, capacity: 350, pressure: 'high' },
  ]);

  const toggleGate = (id: number) => {
    setGates(prev =>
      prev.map(gate =>
        gate.id === id
          ? { ...gate, status: gate.status === 'open' ? 'closed' : 'open' }
          : gate
      )
    );
    toast.success(`Gate ${id} status updated`);
  };

  const autoOptimize = () => {
    toast.success('AI optimization applied: Opening high-capacity gates and redistributing flow');
  };

  const getPressureColor = (pressure: string) => {
    switch (pressure) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2>Dynamic Gate Control</h2>
        <p className="text-muted-foreground">AI-powered gate management based on crowd pressure</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Gates</p>
          <p className="text-3xl mt-1">{gates.filter(g => g.status === 'open').length}/{gates.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Throughput</p>
          <p className="text-3xl mt-1">{gates.reduce((acc, g) => acc + g.throughput, 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">visitors/hour</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">High Pressure Gates</p>
          <p className="text-3xl mt-1">{gates.filter(g => g.pressure === 'high').length}</p>
          <Badge variant="destructive" className="mt-1">Action Needed</Badge>
        </Card>
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={autoOptimize}>
          Auto-Optimize Gate Configuration
        </Button>
        <Button variant="outline">
          Emergency: Open All Gates
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {gates.map(gate => (
          <Card key={gate.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3>{gate.name}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{gate.type}</Badge>
                  <Badge variant={gate.status === 'open' ? 'default' : 'secondary'}>
                    {gate.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {gate.status === 'open' ? (
                  <DoorOpen className="w-6 h-6 text-green-600" />
                ) : (
                  <DoorClosed className="w-6 h-6 text-gray-400" />
                )}
                <Switch
                  checked={gate.status === 'open'}
                  onCheckedChange={() => toggleGate(gate.id)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Throughput</span>
                <span>{gate.throughput} / {gate.capacity}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    gate.throughput / gate.capacity > 0.8
                      ? 'bg-red-600'
                      : gate.throughput / gate.capacity > 0.5
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${(gate.throughput / gate.capacity) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Crowd Pressure</span>
                <span className={`capitalize ${getPressureColor(gate.pressure)}`}>
                  {gate.pressure}
                  {gate.pressure === 'high' ? (
                    <TrendingUp className="inline w-4 h-4 ml-1" />
                  ) : (
                    <TrendingDown className="inline w-4 h-4 ml-1" />
                  )}
                </span>
              </div>

              {gate.pressure === 'high' && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-2 mt-2">
                  <p className="text-xs text-red-800 dark:text-red-200">
                    ⚠️ AI Suggestion: {gate.type === 'entry' ? 'Activate additional entry gate' : 'Consider one-way flow'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 mt-6">
        <h3 className="mb-4">Real-time Gate Recommendations</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded">
            <span className="text-blue-600">💡</span>
            <p className="text-sm">Open VIP Gate to reduce pressure on Main Entrance</p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm">Courtyard Gate approaching capacity - consider flow redirection</p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded">
            <span className="text-green-600">✓</span>
            <p className="text-sm">Exit gates operating within optimal range</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
