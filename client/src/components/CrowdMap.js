import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { connectSocket, subscribeToCrowdUpdates, unsubscribeToCrowdUpdates } from '../utils/socket';

const CrowdMap = ({ interactive = true }) => {
  const svgRef = useRef();
  const [crowdData, setCrowdData] = useState([
    { x: 300, y: 350, density: 0 },
    { x: 300, y: 200, density: 0 },
    { x: 300, y: 100, density: 0 },
  ]);

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

    return () => {
      unsubscribeToCrowdUpdates();
    };
  }, []);
  
  useEffect(() => {
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
    
    // Create heat circles for crowd density
    svg.selectAll('circle')
      .data(crowdData)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 20)
      .attr('fill', d => d3.interpolateRdYlGn(1 - d.density))
      .attr('opacity', 0.6);
      
  }, [interactive]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default CrowdMap;