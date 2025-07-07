// src/components/GridSlicer.js
import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const data = [
  { category: 'A', value: 30 },
  { category: 'B', value: 80 },
  { category: 'C', value: 45 },
  { category: 'A', value: 60 },
  { category: 'B', value: 20 },
  { category: 'C', value: 90 }
];

const categories = ['A', 'B', 'C'];

const GridSlicer = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    setSelectedCategory(newItem.i);
  };

  const filteredData = selectedCategory
    ? data.filter(d => d.category === selectedCategory)
    : data;

  const layout = categories.map((category, index) => ({
    i: category,
    x: 0,
    y: index,
    w: 2,
    h: 1,
  }));

  return (
    <div>
      <GridLayout
        className="layout"
        layout={layout}
        cols={2}
        rowHeight={50}
        width={400}
        onDragStop={onDragStop}
      >
        {categories.map(category => (
          <div key={category} style={{ background: '#456C86', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {category}
          </div>
        ))}
      </GridLayout>
      
      <div>
        <h3>Filtered Data:</h3>
        <ul>
          {filteredData.map((d, i) => (
            <li key={i}>{`Category: ${d.category}, Value: ${d.value}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GridSlicer;















// // src/components/BarChartWithSlicer.js
// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';

// const BarChartWithSlicer = () => {
//   const data = [
//     { category: 'A', value: 30 },
//     { category: 'B', value: 80 },
//     { category: 'C', value: 45 },
//     { category: 'A', value: 60 },
//     { category: 'B', value: 20 },
//     { category: 'C', value: 90 }
//   ];

//   const categories = [...new Set(data.map(d => d.category))];
//   const [selectedCategory, setSelectedCategory] = useState(categories[0]);
//   const svgRef = useRef();

//   useEffect(() => {
//     const filteredData = data.filter(d => d.category === selectedCategory);
    
//     // Set up the chart
//     const svg = d3.select(svgRef.current)
//       .attr('width', 500)
//       .attr('height', 300);

//     svg.selectAll('*').remove();

//     svg.selectAll('rect')
//       .data(filteredData)
//       .enter()
//       .append('rect')
//       .attr('x', (d, i) => i * 50)
//       .attr('y', d => 300 - d.value)
//       .attr('width', 40)
//       .attr('height', d => d.value)
//       .attr('fill', 'steelblue');

//   }, [selectedCategory]);

//   return (
//     <div>
//       <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
//         {categories.map(category => (
//           <option key={category} value={category}>{category}</option>
//         ))}
//       </select>
//       <svg ref={svgRef}></svg>
//     </div>
//   );
// };

// export default BarChartWithSlicer;


// src/components/DragSlicer.js
// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const data = [
//   { category: 'A', value: 30 },
//   { category: 'B', value: 80 },
//   { category: 'C', value: 45 },
//   { category: 'A', value: 60 },
//   { category: 'B', value: 20 },
//   { category: 'C', value: 90 }
// ];

// const categories = ['A', 'B', 'C'];

// const BarChartWithSlicer = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const { draggableId } = result;
//     setSelectedCategory(draggableId);
//   };

//   const filteredData = selectedCategory
//     ? data.filter(d => d.category === selectedCategory)
//     : data;

//   return (
//     <div>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="categories">
//           {(provided) => (
//             <div
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//               style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}
//             >
//               {categories.map((category, index) => (
//                 <Draggable key={category} draggableId={category} index={index}>
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       style={{
//                         userSelect: 'none',
//                         padding: '16px',
//                         margin: '0 0 8px 0',
//                         minHeight: '50px',
//                         backgroundColor: '#456C86',
//                         color: 'white',
//                         ...provided.draggableProps.style
//                       }}
//                     >
//                       {category}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
      
//       <div>
//         <h3>Filtered Data:</h3>
//         <ul>
//           {filteredData.map((d, i) => (
//             <li key={i}>{`Category: ${d.category}, Value: ${d.value}`}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default BarChartWithSlicer;
