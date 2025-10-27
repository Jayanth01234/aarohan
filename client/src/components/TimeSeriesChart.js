import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const TimeSeriesChart = ({ data, width = 600, height = 300, margin = { top: 20, right: 30, bottom: 50, left: 50 } }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.frames || data.frames.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const x = d3.scaleLinear()
      .domain(d3.extent(data.frames, d => d.t_seconds))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.frames, d => d.person_count) * 1.2])
      .nice()
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => x(d.t_seconds))
      .y(d => y(d.person_count));

    // Create group for the chart
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}s`))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .style('text-anchor', 'middle')
      .text('Time (seconds)');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -innerHeight / 2)
      .attr('dy', '0.71em')
      .attr('fill', 'currentColor')
      .style('text-anchor', 'middle')
      .text('People Count');

    // Add line
    g.append('path')
      .datum(data.frames)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add points
    g.selectAll('circle')
      .data(data.frames)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.t_seconds))
      .attr('cy', d => y(d.person_count))
      .attr('r', 3)
      .attr('fill', d => d.overcrowded ? 'red' : 'steelblue')
      .append('title')
      .text(d => `Time: ${d.t_seconds}s\nPeople: ${d.person_count}`);

  }, [data, width, height, margin]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Crowd Count Over Time</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TimeSeriesChart;
