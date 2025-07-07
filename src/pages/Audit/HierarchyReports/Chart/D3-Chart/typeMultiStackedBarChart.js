import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const TypeMultiStackedBarChart = ({
  compliantCount,
  nonCompliantCount,
  partiallyCompliantCount,
  notApplicableCount,
  complaint_type_array,
  non_complaint_type_array,
  partially_compliant_type_array,
  not_applicable_type_array
}) => {
  const chartRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.4 
  });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.4
      });
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const margin = { top: 50, right: 200, bottom: 50, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg.selectAll("*").remove(); // Clear previous chart before re-rendering

    const data = [
      { category: "Compliant", count: compliantCount },
      { category: "Non Compliant", count: nonCompliantCount },
      { category: "Partially Compliant", count: partiallyCompliantCount },
      { category: "Not Applicable", count: notApplicableCount }
    ];

    // Function to update stacked data
    const updateCategoryData = (categoryData, typeArray) => {
      typeArray.forEach(({ type_name, count }) => {
        categoryData[type_name.toLowerCase()] = count;
      });
    };

    data.forEach((categoryData) => {
      switch (categoryData.category) {
        case "Compliant":
          updateCategoryData(categoryData, complaint_type_array);
          break;
        case "Non Compliant":
          updateCategoryData(categoryData, non_complaint_type_array);
          break;
        case "Partially Compliant":
          updateCategoryData(categoryData, partially_compliant_type_array);
          break;
        case "Not Applicable":
          updateCategoryData(categoryData, not_applicable_type_array);
          break;
        default:
          break;
      }
    });

    // Define X and Y scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width + margin.left])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) * 1.2]) // Slight padding for better visualization
      .range([height + margin.top, margin.top]);
      const getRandomColor = () => {
        const component = () => Math.floor(Math.random() * 100 + 150); // Adjust the range for lighter colors
        return `rgb(${component()}, ${component()}, ${component()})`;
      };




     const domain = Array.from(new Set(data.flatMap(d => Object.keys(d).filter(key => key !== 'category' && key !== 'count'))));
        const colorScale = d3
          .scaleOrdinal()
          .domain(domain)
          .range(domain.map(() => getRandomColor()));
    

    const keys = Object.keys(data[0]).filter((k) => k !== "category" && k !== "count");

    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    // Add groups for stacked bars
    const groups = svg
      .selectAll(".bar-group")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d) => colorScale(d.key));
      

    // Draw bars
    groups
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.data.category))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth());



    groups
      .selectAll("text")
      .data((d) => d)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.data.category) + xScale.bandwidth() / 2)
      .attr("y", (d) => (yScale(d[0]) + yScale(d[1])) / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-size", "12px")
      .text((d, i, nodes) => {
        const key = d3.select(nodes[i].parentNode).datum().key; // Get the key (type name)
        const value = d[1] - d[0]; // Get the value of the stack
        return value > 0 ? `${key}: ${value}` : ""; // Display key and value
      });


    // Add total count on top of bars
    svg
      .selectAll(".total-text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.category) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      // .text((d) => d.count);
      .text(d => d?.count > 0 ? d?.count : 'No Data Available');

    // Add Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 70}, ${margin.top})`);

    keys.forEach((key, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      legendRow
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colorScale(key));

      legendRow
        .append("text")
        .attr("x", 25)
        .attr("y", 14)
        .attr("font-size", "14px")
        .text(key);
    });
  }, [
    dimensions,
    compliantCount,
    nonCompliantCount,
    partiallyCompliantCount,
    notApplicableCount
  ]);

  return <svg ref={chartRef} width="100%" height="100%"></svg>;
};

export default TypeMultiStackedBarChart;
