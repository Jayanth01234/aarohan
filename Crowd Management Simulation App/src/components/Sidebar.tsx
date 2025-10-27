import { ViewMode } from '../App';
import { Map, Flame, BarChart3, Settings, DoorOpen, Users, Eye, AlertTriangle, Route, Leaf } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const navItems = [
    { id: 'simulation' as ViewMode, label: '3D Simulation', icon: Map },
    { id: 'heatmap' as ViewMode, label: 'Heatmap', icon: Flame },
    { id: 'analytics' as ViewMode, label: 'Analytics', icon: BarChart3 },
    { id: 'scenarios' as ViewMode, label: 'Scenarios', icon: Settings },
    { id: 'pathOptimization' as ViewMode, label: 'Path Optimization', icon: Route },
    { id: 'gates' as ViewMode, label: 'Gate Control', icon: DoorOpen },
    { id: 'resources' as ViewMode, label: 'Resources', icon: Users },
    { id: 'visitor' as ViewMode, label: 'Visitor View', icon: Eye },
    { id: 'emergency' as ViewMode, label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-8 h-8 text-primary" />
          <h1 className="text-primary">Heritage Guard</h1>
        </div>
        <p className="text-muted-foreground text-sm">Smart Crowd Management</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Live Status: <span className="text-green-600">Connected</span>
        </p>
      </div>
    </aside>
  );
}
