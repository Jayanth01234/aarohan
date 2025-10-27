import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CrowdSimulation } from './components/CrowdSimulation';
import { HeatmapView } from './components/HeatmapView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { GateControl } from './components/GateControl';
import { ResourcePlanner } from './components/ResourcePlanner';
import { VisitorView } from './components/VisitorView';
import { EmergencySimulator } from './components/EmergencySimulator';
import { PathOptimization } from './components/PathOptimization';

export type ViewMode = 'simulation' | 'heatmap' | 'analytics' | 'scenarios' | 'gates' | 'resources' | 'visitor' | 'emergency' | 'pathOptimization';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('simulation');

  return (
    <div className="size-full flex bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 overflow-auto">
        {activeView === 'simulation' && <CrowdSimulation />}
        {activeView === 'heatmap' && <HeatmapView />}
        {activeView === 'analytics' && <AnalyticsDashboard />}
        {activeView === 'scenarios' && <ScenarioBuilder />}
        {activeView === 'gates' && <GateControl />}
        {activeView === 'resources' && <ResourcePlanner />}
        {activeView === 'visitor' && <VisitorView />}
        {activeView === 'emergency' && <EmergencySimulator />}
        {activeView === 'pathOptimization' && <PathOptimization />}
      </main>
    </div>
  );
}
