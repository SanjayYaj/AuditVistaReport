import React from "react";

const DepartmentTree = ({ data }) => {
  // Build tree from flat data
  const buildTree = (items) => {
    const map = {};
    const roots = [];

    items.forEach((item) => {
      map[item._id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children.push(map[item._id]);
      } else {
        roots.push(map[item._id]);
      }
    });

    return roots;
  };

  // Render node recursively
  const renderNode = (node, level = 0) => (
    <li key={node._id}>
      <div className={level > 0 ? "text-muted" : ""}>
        <strong>{node.dept_name}</strong> – {node.dept_code}
      </div>
      {node.children && node.children.length > 0 && (
        <ul style={{ paddingLeft: "1rem" }}>
          {node.children.map((child) => renderNode(child, level + 1))}
        </ul>
      )}
    </li>
  );

  const tree = buildTree(data);

  return (
    <div>
      <ul>{tree.map((node) => renderNode(node))}</ul>
    </div>
  );
};

export default DepartmentTree;











// import React from "react";

// const DepartmentTree = ({ data }) => {
//   // Build tree from flat data
//   const buildTree = (items) => {
//     const map = {};
//     const roots = [];

//     items.forEach((item) => {
//       map[item._id] = { ...item, children: [] };
//     });

//     items.forEach((item) => {
//       if (item.parent_id && map[item.parent_id]) {
//         map[item.parent_id].children.push(map[item._id]);
//       } else {
//         roots.push(map[item._id]);
//       }
//     });

//     return roots;
//   };

//   // Render node recursively
//   const renderNode = (node) => (
//     <li key={node._id}>
//       <div>
//         <strong>{node.dept_name}</strong> – {node.dept_code}
//       </div>
//       {node.children && node.children.length > 0 && (
//         <ul style={{ paddingLeft: "1rem" }}>
//           {node.children.map((child) => renderNode(child))}
//         </ul>
//       )}
//     </li>
//   );

//   const tree = buildTree(data);

//   return (
//     <div>
//         {console.log('tree :>> ', tree)}
//       <ul>{tree.map((node) => renderNode(node))}</ul>
//     </div>
//   );
// };

// export default DepartmentTree;
