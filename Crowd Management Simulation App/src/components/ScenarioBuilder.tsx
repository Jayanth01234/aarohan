import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Play, Save, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type ScenarioType = 'normal' | 'festival' | 'vip' | 'emergency';

export function ScenarioBuilder() {
  const [scenarioType, setScenarioType] = useState<ScenarioType>('normal');
  const [visitorCount, setVisitorCount] = useState([5000]);
  const [peakHours, setPeakHours] = useState([14]);
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [specialEvents, setSpecialEvents] = useState<string[]>([]);

  const scenarios = {
    normal: {
      name: 'Normal Day',
      description: 'Regular weekday operations',
      expectedCount: '3,000-5,000',
      riskLevel: 'Low',
    },
    festival: {
      name: 'Festival Rush',
      description: 'Major religious festival with peak crowds',
      expectedCount: '15,000-25,000',
      riskLevel: 'High',
    },
    vip: {
      name: 'VIP Visit',
      description: 'Dignitary visit with security protocols',
      expectedCount: '2,000-3,000',
      riskLevel: 'Medium',
    },
    emergency: {
      name: 'Emergency Evacuation',
      description: 'Rapid evacuation simulation',
      expectedCount: 'Variable',
      riskLevel: 'Critical',
    },
  };

  const handleRunSimulation = () => {
    toast.success(`Running ${scenarios[scenarioType].name} simulation...`);
  };

  const handleSaveScenario = () => {
    toast.success('Scenario configuration saved successfully');
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2>Scenario Builder</h2>
        <p className="text-muted-foreground">Simulate different crowd situations and test management strategies</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Scenario Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Scenario Type</Label>
                <Select value={scenarioType} onValueChange={(value) => setScenarioType(value as ScenarioType)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Day</SelectItem>
                    <SelectItem value="festival">Festival Rush</SelectItem>
                    <SelectItem value="vip">VIP Visit</SelectItem>
                    <SelectItem value="emergency">Emergency Evacuation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expected Visitor Count: {visitorCount[0].toLocaleString()}</Label>
                <Slider
                  value={visitorCount}
                  onValueChange={setVisitorCount}
                  min={1000}
                  max={30000}
                  step={500}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Peak Hour: {peakHours[0]}:00</Label>
                <Slider
                  value={peakHours}
                  onValueChange={setPeakHours}
                  min={6}
                  max={22}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Weather Condition</Label>
                <Select value={weatherCondition} onValueChange={setWeatherCondition}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear Sky</SelectItem>
                    <SelectItem value="rain">Rainy</SelectItem>
                    <SelectItem value="hot">Extremely Hot</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Additional Parameters</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={specialEvents.includes('media') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSpecialEvents(prev =>
                        prev.includes('media') ? prev.filter(e => e !== 'media') : [...prev, 'media']
                      );
                    }}
                  >
                    Media Coverage
                  </Button>
                  <Button
                    variant={specialEvents.includes('security') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSpecialEvents(prev =>
                        prev.includes('security') ? prev.filter(e => e !== 'security') : [...prev, 'security']
                      );
                    }}
                  >
                    High Security
                  </Button>
                  <Button
                    variant={specialEvents.includes('children') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSpecialEvents(prev =>
                        prev.includes('children') ? prev.filter(e => e !== 'children') : [...prev, 'children']
                      );
                    }}
                  >
                    School Groups
                  </Button>
                  <Button
                    variant={specialEvents.includes('elderly') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSpecialEvents(prev =>
                        prev.includes('elderly') ? prev.filter(e => e !== 'elderly') : [...prev, 'elderly']
                      );
                    }}
                  >
                    Elderly Visitors
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleRunSimulation} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
              <Button variant="outline" onClick={handleSaveScenario}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Simulation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border rounded p-4">
                <p className="text-sm text-muted-foreground">Predicted Wait Time</p>
                <p className="text-2xl mt-1">18 mins</p>
              </div>
              <div className="border border-border rounded p-4">
                <p className="text-sm text-muted-foreground">Congestion Points</p>
                <p className="text-2xl mt-1">3 zones</p>
              </div>
              <div className="border border-border rounded p-4">
                <p className="text-sm text-muted-foreground">Required Staff</p>
                <p className="text-2xl mt-1">45 people</p>
              </div>
              <div className="border border-border rounded p-4">
                <p className="text-sm text-muted-foreground">Safety Score</p>
                <p className="text-2xl mt-1">82/100</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Current Scenario</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="mt-1">{scenarios[scenarioType].name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{scenarios[scenarioType].description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Range</p>
                <p className="mt-1">{scenarios[scenarioType].expectedCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge
                  variant={
                    scenarios[scenarioType].riskLevel === 'Low'
                      ? 'default'
                      : scenarios[scenarioType].riskLevel === 'Medium'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className="mt-1"
                >
                  {scenarios[scenarioType].riskLevel}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">AI Recommendations</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="text-blue-900 dark:text-blue-100">
                  ✓ Open gates 2, 3, and 5 for entry
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                <p className="text-yellow-900 dark:text-yellow-100">
                  ⚠ Deploy security at Sanctum entrance
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                <p className="text-green-900 dark:text-green-100">
                  ✓ Activate one-way flow in Courtyard
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Saved Scenarios</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                Diwali 2024 Plan
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                Weekend Rush Template
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                Emergency Protocol V2
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
