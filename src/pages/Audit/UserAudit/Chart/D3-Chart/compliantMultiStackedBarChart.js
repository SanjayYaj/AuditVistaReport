import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// Function to generate a random color (lighter shades)
const getRandomColor = () => {
  const component = () => Math.floor(Math.random() * 100 + 150); // Adjust the range for lighter colors
  return `rgb(${component()}, ${component()}, ${component()})`;
};

const CompliantMultiStackedBarChart = ({
  complaint_critical_count,
  complaint_high_count,
  complaint_low_count,
  complaint_medium_count,
  complaint_no_impact_count,
  critical_type_info,
  high_type_info,
  low_type_info,
  medium_type_info,
  no_impact_type_info,
}) => {
  const chartRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1000, height: 300 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height: 300 });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const margin = { top: 15, right: 150, bottom: 40, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const categories = [
      { category: "Critical", count: complaint_critical_count, types: critical_type_info },
      { category: "High", count: complaint_high_count, types: high_type_info },
      { category: "Medium", count: complaint_medium_count, types: medium_type_info },
      { category: "Low", count: complaint_low_count, types: low_type_info },
      { category: "No Impact", count: complaint_no_impact_count, types: no_impact_type_info },
    ];

    categories.forEach((cat) => {
      cat.types?.forEach((type) => {
        cat[type.type_name.toLowerCase()] = type.count;
      });
    });

    const keys = Array.from(
      new Set(categories.flatMap((d) => Object.keys(d).filter((k) => k !== "category" && k !== "count" && k !== "types")))
    );

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(categories, (d) => d.count)])
      .range([margin.left, width + margin.left]);

    const yScale = d3.scaleBand()
      .domain(categories.map((d) => d.category))
      .range([margin.top, height + margin.top])
      .padding(0.3);

    // Replace color scale with random colors
    const colorScale = d3.scaleOrdinal()
      .domain(keys)
      .range(keys.map(() => getRandomColor()));  // Use the getRandomColor function

    const stackedData = d3.stack().keys(keys)(categories);

    const barGroups = svg.selectAll(".bar-group")
      .data(stackedData)
      .enter().append("g")
      .attr("class", "bar-group")
      .attr("fill", (d) => colorScale(d.key));

    barGroups.selectAll("rect")
      .data((d) => d)
      .enter().append("rect")
      .attr("y", (d) => yScale(d.data.category))
      .attr("x", (d) => xScale(d[0]))
      .attr("width", (d) => xScale(d[1]) - xScale(d[0]))
      .attr("height", yScale.bandwidth())
      .on("mouseover", function () {
        d3.select(this).style("opacity", 0.7);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
      });

    const fontSize = dimensions.width < 600 ? "8px" : "12px";

    barGroups.selectAll("text")
      .data((d) => d)
      .enter().append("text")
      .attr("x", (d) => (xScale(d[0]) + xScale(d[1])) / 2)
      .attr("y", (d) => yScale(d.data.category) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", fontSize)
      .text((d, i, nodes) => {
        const key = d3.select(nodes[i].parentNode).datum().key;
        const value = d[1] - d[0];
        return value > 0 ? `${dimensions.width > 1300 ? key + ":" :""} ${value}` : "";
      });

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    svg.selectAll(".total-label")
      .data(categories)
      .enter().append("text")
      .attr("x", (d) => xScale(d.count) + 5)
      .attr("y", (d) => yScale(d.category) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .style("fill", "black")
      .style("font-size", "10px")
      .attr("font-weight", "bold")
      .text(d => d?.count > 0 ? d?.count : 'No Data Available');

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + margin.left + 10}, ${margin.top})`);

    legend.selectAll("rect")
      .data(keys)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 18)
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", (d) => colorScale(d));

    legend.selectAll("text")
      .data(keys)
      .enter().append("text")
      .attr("x", 18)
      .attr("y", (d, i) => i * 18 + 7)
      .attr("dy", ".35em")
      .style("font-size", "10px")
      .style("fill", "black")
      .text((d) => d);
  }, [dimensions, complaint_critical_count, complaint_high_count, complaint_low_count, complaint_medium_count, complaint_no_impact_count]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "auto" }}>
      <svg ref={chartRef} width={dimensions.width} height={dimensions.height}></svg>
    </div>
  );
};

export default CompliantMultiStackedBarChart;
