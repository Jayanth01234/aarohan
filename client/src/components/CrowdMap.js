import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { connectSocket, subscribeToCrowdUpdates, unsubscribeToCrowdUpdates, subscribeToMedia, unsubscribeToMedia } from '../utils/socket';

const CrowdMap = ({ interactive = true }) => {
  const svgRef = useRef();
  const [crowdData, setCrowdData] = useState([
    { x: 300, y: 350, density: 0 },
    { x: 300, y: 200, density: 0 },
    { x: 300, y: 100, density: 0 },
  ]);
  const [media, setMedia] = useState(null); // { url, type }
  const [showThermal, setShowThermal] = useState(true);

  // Hardcoded thermal hotspots (x,y,intensity [0..1])
  const thermalPoints = [
    { x: 180, y: 180, intensity: 0.9 }, // inside main hall left
    { x: 300, y: 160, intensity: 0.7 }, // center main hall
    { x: 260, y: 80, intensity: 0.6 },  // near shrine
    { x: 300, y: 370, intensity: 0.5 }, // entrance area
  ];

  useEffect(() => {
    // Connect to Socket.IO
    connectSocket();
    subscribeToCrowdUpdates((data) => {
      // Convert zone data to visualization data
      const newCrowdData = data.zones.map((zone, index) => ({
        x: crowdData[index].x,
        y: crowdData[index].y,
        density: zone.current / zone.capacity
      }));
      setCrowdData(newCrowdData);
    });
    subscribeToMedia((payload) => {
      if (payload && payload.url) {
        setMedia({ url: payload.url, type: payload.type || '' });
      }
    });

    return () => {
      unsubscribeToCrowdUpdates();
      unsubscribeToMedia();
    };
  }, []);

  useEffect(() => {
    if (media) return; // Don't draw overlays when media preview is active
    // Basic temple layout
    const width = 600;
    const height = 400;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    // Clear previous content
    svg.selectAll('*').remove();
    
    // Draw temple outline
    const templeLayout = [
      { type: 'entrance', x: 300, y: 380, width: 40, height: 20 },
      { type: 'mainHall', x: 150, y: 100, width: 300, height: 200 },
      { type: 'shrine', x: 250, y: 50, width: 100, height: 100 },
    ];
    
    // Draw each area
    templeLayout.forEach(area => {
      svg.append('rect')
        .attr('x', area.x)
        .attr('y', area.y)
        .attr('width', area.width)
        .attr('height', area.height)
        .attr('fill', 'none')
        .attr('stroke', '#666')
        .attr('class', `area-${area.type}`);
    });
    
    // Create heat circles for crowd density (people)
    svg.append('g').selectAll('circle.crowd')
      .data(crowdData)
      .enter()
      .append('circle')
      .attr('class', 'crowd')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 20)
      .attr('fill', d => d3.interpolateRdYlGn(1 - d.density))
      .attr('opacity', 0.6);

    // Thermal overlay (hardcoded)
    if (showThermal) {
      const thermalGroup = svg.append('g').attr('class', 'thermal');
      thermalGroup.selectAll('circle.thermal-blob')
        .data(thermalPoints)
        .enter()
        .append('circle')
        .attr('class', 'thermal-blob')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => 50 + d.intensity * 40)
        .attr('fill', d => d3.interpolateInferno(d.intensity))
        .attr('opacity', 0.35);

      // Legend
      const legendX = width - 120;
      const legendY = 20;
      const legendH = 120;
      const legendW = 14;
      const legend = thermalGroup.append('g').attr('class', 'legend');
      const gradId = 'thermal-grad';
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient')
        .attr('id', gradId)
        .attr('x1', '0%').attr('y1', '100%')
        .attr('x2', '0%').attr('y2', '0%');
      const stops = d3.range(0, 1.01, 0.1);
      stops.forEach(s => {
        grad.append('stop')
          .attr('offset', `${s * 100}%`)
          .attr('stop-color', d3.interpolateInferno(s));
      });
      legend.append('rect')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('width', legendW)
        .attr('height', legendH)
        .attr('fill', `url(#${gradId})`)
        .attr('stroke', '#999');
      legend.append('text').attr('x', legendX + 22).attr('y', legendY + 10).attr('font-size', 10).text('Heat');
      legend.append('text').attr('x', legendX + 22).attr('y', legendY + legendH).attr('font-size', 10).text('Low');
      legend.append('text').attr('x', legendX + 22).attr('y', legendY + 4).attr('font-size', 10).text('High');
    }
      
  }, [interactive, media, showThermal, crowdData]);

  return (
    <div className="relative">
      {!media && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2 bg-white/80 rounded px-2 py-1 text-xs shadow">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={showThermal} onChange={e => setShowThermal(e.target.checked)} />
            Thermal
          </label>
        </div>
      )}
      {media ? (
        <div className="w-full">
          {media.type?.startsWith('video/') ? (
            <video src={media.url} className="w-full h-auto" controls autoPlay loop muted />
          ) : (
            <img src={media.url} alt="CV preview" className="w-full h-auto" />
          )}
        </div>
      ) : (
        <svg ref={svgRef} className="w-full h-auto"></svg>
      )}
    </div>
  );
};

export default CrowdMap;