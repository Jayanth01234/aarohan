import { Card } from './ui/card';
import { UploadCounter } from './UploadCounter';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const footfallData = [
  { time: '6 AM', visitors: 120 },
  { time: '8 AM', visitors: 450 },
  { time: '10 AM', visitors: 890 },
  { time: '12 PM', visitors: 1240 },
  { time: '2 PM', visitors: 980 },
  { time: '4 PM', visitors: 1450 },
  { time: '6 PM', visitors: 1120 },
  { time: '8 PM', visitors: 340 },
];

const weeklyData = [
  { day: 'Mon', visitors: 3200, predicted: 3400 },
  { day: 'Tue', visitors: 2800, predicted: 2900 },
  { day: 'Wed', visitors: 3100, predicted: 3000 },
  { day: 'Thu', visitors: 4200, predicted: 4100 },
  { day: 'Fri', visitors: 5100, predicted: 5300 },
  { day: 'Sat', visitors: 7800, predicted: 8000 },
  { day: 'Sun', visitors: 8900, predicted: 8700 },
];

const zoneData = [
  { zone: 'Entrance', current: 234, capacity: 500 },
  { zone: 'Sanctum', current: 456, capacity: 600 },
  { zone: 'Courtyard', current: 189, capacity: 800 },
  { zone: 'Rest Area', current: 78, capacity: 300 },
  { zone: 'Exit', current: 134, capacity: 400 },
];

export function AnalyticsDashboard() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2>AI-Driven Analytics Dashboard</h2>
        <p className="text-muted-foreground">Real-time insights and predictive analytics</p>
      </div>

      <div className="mb-6">
        <UploadCounter />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Live Footfall</p>
              <p className="text-3xl mt-1">4,567</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from yesterday</p>
            </div>
            <Users className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Peak Hour</p>
              <p className="text-3xl mt-1">4-6 PM</p>
              <p className="text-xs text-muted-foreground mt-1">Expected: 1,450 visitors</p>
            </div>
            <Clock className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Stay Time</p>
              <p className="text-3xl mt-1">42m</p>
              <p className="text-xs text-muted-foreground mt-1">Median: 38 minutes</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-3xl mt-1">2</p>
              <p className="text-xs text-yellow-600 mt-1">Sanctum High Density</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-600 opacity-20" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="mb-4">Today's Footfall Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={footfallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Weekly Trends & Predictions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Zone Occupancy vs Capacity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={zoneData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#6366f1" name="Current Occupancy" />
            <Bar dataKey="capacity" fill="#e5e7eb" name="Max Capacity" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="p-4">
          <h4 className="mb-2">AI Insight</h4>
          <p className="text-sm text-muted-foreground">
            Peak crowd expected between 4-6 PM. Recommend opening additional gates and deploying 3 more volunteers at Sanctum entrance.
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="mb-2">Crowd Prediction</h4>
          <p className="text-sm text-muted-foreground">
            Tomorrow (Festival Day): Expected 12,000+ visitors. High congestion likely from 10 AM - 8 PM.
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="mb-2">Sustainability Metric</h4>
          <p className="text-sm text-muted-foreground">
            Current visitor flow is 15% below heritage preservation threshold. Site wear minimal.
          </p>
        </Card>
      </div>
    </div>
  );
}
