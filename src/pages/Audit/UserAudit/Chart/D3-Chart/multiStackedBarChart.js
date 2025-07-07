import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const MultiStackedBarChart = (props) => {
  const chartRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.min(entry.contentRect.height, 400), 
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const margin = { top: 30, right: 20, bottom: 80, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .html(""); 

    const data = [
      {
        category: 'Compliant',
        critical: props.complaint_critical_count,
        high: props.complaint_high_count,
        low: props.complaint_low_count,
        medium: props.complaint_medium_count,
        no_impact: props.complaint_no_impact_count,
      },
      {
        category: 'Non Compliant',
        critical: props.non_compliant_critical_count,
        high: props.non_compliant_high_count,
        low: props.non_compliant_low_count,
        medium: props.non_compliant_medium_count,
        no_impact: props.non_compliant_no_impact_count,
      },
      {
        category: 'Partially Compliant',
        critical: props.partially_compliant_critical_count,
        high: props.partially_compliant_high_count,
        low: props.partially_compliant_low_count,
        medium: props.partially_compliant_medium_count,
        no_impact: props.partially_compliant_no_impact_count,
      },
      {
        category: 'Not Applicable',
        critical: props.not_applicable_critical_count,
        high: props.not_applicable_high_count,
        low: props.not_applicable_low_count,
        medium: props.not_applicable_medium_count,
        no_impact: props.not_applicable_no_impact_count,
      },
    ];

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([margin.left, width + margin.left])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(Object.values(d).slice(1))) || 1])
      .range([height + margin.top, margin.top]);

    const colorScale = d3.scaleOrdinal()
      .domain(['no_impact', 'low', 'medium', 'high', 'critical'])
      .range(['rgb(85, 110, 230)', '#34c38f', '#50a5f1', '#f1b44c', '#f46a6a']);

    const stackedData = d3.stack()
      .keys(['critical', 'high', 'medium', 'low', 'no_impact'])(data);

    const barGroups = svg.selectAll('.bar-group')
      .data(stackedData)
      .enter().append('g')
      .attr('class', 'bar-group')
      .attr('fill', d => colorScale(d.key));

    barGroups.selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => xScale(d.data.category))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());

    // Show stack labels and values inside bars
    barGroups.selectAll('text')
      .data(d => d)
      .enter().append('text')
      .attr('x', d => xScale(d.data.category) + xScale.bandwidth() / 2)
      .attr('y', d => (yScale(d[1]) + yScale(d[0])) / 2) // Center inside the bar
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      // .text(d => d[1] - d[0] > 0 ? ` ${d[1] - d[0]}` : '') 
       .text((d, i, nodes) => {
              const key = d3.select(nodes[i].parentNode).datum().key; // Get the key (type name)
              const value = d[1] - d[0]; // Get the value of the stack
              return value > 0 ? `${key}: ${value}` : ""; // Display key and value
            })
      .attr('fill', 'black')
      .attr('font-size', '10px')
      // .attr('font-weight', 'bold');
      

    // Show total values on top of each stack
    svg.selectAll('.total-text')
      .data(data)
      .enter().append('text')
      .attr('class', 'total-text')
      .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d3.sum(Object.values(d).slice(1))) - 5) // Position slightly above stack
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      // .text(d => { d3.sum(Object.values(d).slice(1))});
      .text(d => (d3.sum(Object.values(d).slice(1)) !== 0 ? d3.sum(Object.values(d).slice(1)) : 'No Data'));



    // Draw axes
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add legend
    const legendData = [
      { name: "Critical", color: "#f46a6a" },
      { name: "High", color: "#f1b44c" },
      { name: "Medium", color: "#50a5f1" },
      { name: "Low", color: "#34c38f" },
      { name: "No Impact", color: "rgb(85, 110, 230)" }
    ];

    const legendWidth = 50;
    const legendHeight = 15;
    const legendSpacing = 10;

    const legend = svg.append("g")
      .attr("transform", `translate(${width / 2 - (legendWidth * 2 + legendSpacing)}, ${height + margin.top + 40})`);

    legend.selectAll("rect")
      .data(legendData)
      .enter().append("rect")
      .attr("x", (_, i) => i * (legendWidth + legendSpacing))
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", d => d.color);

    legend.selectAll("text")
      .data(legendData)
      .enter().append("text")
      .attr("x", (_, i) => i * (legendWidth + legendSpacing) + (legendWidth + legendSpacing) / 2)
      .attr("y", legendHeight + 10)
      .text(d => d.name)
      .attr("font-size", "11px")
      .attr("fill", "#333")
      .attr("text-anchor", "middle");

  }, [dimensions, props]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', maxHeight: '350px', overflow: 'hidden' }}>
      <svg ref={chartRef} style={{ maxWidth: '100%', height: 'auto', maxHeight: '350px' }}></svg>
    </div>
  );
};

export default MultiStackedBarChart;






