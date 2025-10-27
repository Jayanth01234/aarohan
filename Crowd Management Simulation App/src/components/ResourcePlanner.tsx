import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserPlus, Shield, Headphones, Heart, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const zoneRequirements = [
  { zone: 'Main Entrance', volunteers: 8, security: 4, medical: 1, required: 10, deployed: 13 },
  { zone: 'Sanctum', volunteers: 12, security: 6, medical: 2, required: 16, deployed: 20 },
  { zone: 'Courtyard', volunteers: 6, security: 3, medical: 1, required: 8, deployed: 10 },
  { zone: 'Rest Area', volunteers: 4, security: 2, medical: 2, required: 6, deployed: 8 },
  { zone: 'Exit Points', volunteers: 5, security: 3, medical: 1, required: 7, deployed: 9 },
];

const resourceEfficiency = [
  { category: 'Crowd Management', current: 85, optimal: 95 },
  { category: 'Security', current: 92, optimal: 95 },
  { category: 'Medical Response', current: 78, optimal: 90 },
  { category: 'Information Desk', current: 88, optimal: 95 },
  { category: 'Emergency Readiness', current: 95, optimal: 100 },
];

export function ResourcePlanner() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2>Resource Planner</h2>
        <p className="text-muted-foreground">AI-driven staff allocation and resource optimization</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-3xl mt-1">60</p>
              <p className="text-xs text-green-600 mt-1">+8 from optimal</p>
            </div>
            <UserPlus className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Security</p>
              <p className="text-3xl mt-1">18</p>
              <Badge variant="default" className="mt-1">Adequate</Badge>
            </div>
            <Shield className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Volunteers</p>
              <p className="text-3xl mt-1">35</p>
              <Badge variant="default" className="mt-1">Optimal</Badge>
            </div>
            <Headphones className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Medical Staff</p>
              <p className="text-3xl mt-1">7</p>
              <Badge variant="secondary" className="mt-1">Good</Badge>
            </div>
            <Heart className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="mb-4">Zone-wise Resource Deployment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneRequirements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="required" fill="#94a3b8" name="Required" />
              <Bar dataKey="deployed" fill="#3b82f6" name="Deployed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Resource Efficiency Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={resourceEfficiency}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              <Radar name="Optimal" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h3 className="mb-4">Zone-wise Personnel Details</h3>
          <div className="space-y-4">
            {zoneRequirements.map((zone, idx) => (
              <div key={idx} className="border border-border rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{zone.zone}</span>
                  </div>
                  <Badge variant={zone.deployed >= zone.required ? 'default' : 'destructive'}>
                    {zone.deployed >= zone.required ? 'Adequate' : 'Understaffed'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Volunteers</p>
                    <p className="mt-1">{zone.volunteers} deployed</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Security</p>
                    <p className="mt-1">{zone.security} deployed</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Medical</p>
                    <p className="mt-1">{zone.medical} deployed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">AI Recommendations</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                <p className="text-green-900 dark:text-green-100">
                  ✓ Current deployment is optimal for expected crowd
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <p className="text-blue-900 dark:text-blue-100">
                  💡 Shift 2 volunteers from Rest Area to Sanctum during peak hours (4-6 PM)
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                <p className="text-yellow-900 dark:text-yellow-100">
                  ⚠ Add 1 medical staff at Main Entrance for festival day
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Request Additional Staff
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Deploy Security Team
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Alert Medical Units
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Shift Schedule</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Morning (6-12)</span>
                <span>42 staff</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Afternoon (12-6)</span>
                <span>60 staff</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Evening (6-10)</span>
                <span>38 staff</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
