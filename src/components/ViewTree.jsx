import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CustomEdge from './CustomEdge'
const ViewTree = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dataParam = queryParams.get('data');
    if (dataParam) {
      try {
        // Decode and parse the graph data
        const graphData = JSON.parse(decodeURIComponent(dataParam));
        const newresp = updateSubtreeValues(graphData);
        console.log(newresp.data);
        processGraphData(newresp.data);
      } catch (error) {
        console.error('Error parsing graph data:', error);
      }
    }
  }, [location]);


  // Function to perform topological sorting and return a map with indices
  const topologicalSortWithIndex = (graph) => {
    const visited = new Set();
    const stack = [];
    const indexMap = new Map();
    
    const visit = (node) => {
      if (visited.has(node)) return;
      visited.add(node);
      if (graph[node]) {
        Object.keys(graph[node]).forEach((neighbor) => visit(neighbor));
      }
      stack.push(node);
    };

    Object.keys(graph).forEach(visit);
    const sortedNodes = stack.reverse();
    
    // Build the index map
    sortedNodes.forEach((node, index) => {
      indexMap.set(node, index);
    });

    return indexMap;
  };


  const updateSubtreeValues = (graph) => {
    const result = JSON.parse(JSON.stringify(graph)); // Deep copy to avoid mutating the original graph
  
    const updateSubtree = (node) => {
      if (!result[node]) return;
      
      // If the node has a number value of 0, update its subtree
      Object.keys(result[node]).forEach((target) => {
        const { key } = result[node][target];
        if (key === 0) {
          // Update the current node and all nodes in the subtree
          updateSubtreeRecursive(target);
        }
      });
    };
  
    const updateSubtreeRecursive = (node) => {
      if (!result[node]) return;
      // Set the number value of the current node to 0
      Object.keys(result[node]).forEach((target) => {
        result[node][target].key = 0;
        updateSubtreeRecursive(target);
      });
    };
  
    Object.keys(result).forEach(updateSubtree);
    return result;
  };
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
      //   const response = {
      //     "GenderCheck": {
      //         "PincodeCheck": {
      //             "key": 0,
      //             "value": "Male"
      //         },
      //         "LoanStatus": {
      //             "key": 2,
      //             "value": "Female"
      //         }
      //     },
      //     "PincodeCheck": {
      //         "LoanStatus": {
      //             "key": 3,
      //             "value": "Starts with 40"
      //         }
      //     },
      //     "DobCheck": {
      //         "GenderCheck": {
      //             "key": 0,
      //             "value": "age>25"
      //         }
      //     }
      // };
  //     const response = {
  //       a: {
  //         b: {
  //           key: 1,
  //           value: "B",
  //         },
  //         c: {
  //           key: 1,
  //           value: "C",
  //         },
  //       },
  //       b: {
  //         d: {
  //           key: 0,
  //           value: "D",
  //         },
  //         e: {
  //           key: 0,
  //           value: "E",
  //         },
  //       },
  //       c: {
  //         f: {
  //           key: 0,
  //           value: "F",
  //         },
  //         g: {
  //           key: 1,
  //           value: "G",
  //         },
  //       },
  //       g: {
  //         h: {
  //           key: 2,
  //           value: "H",
  //         },
  //         i: {
  //           key: 0,
  //           value: "I",
  //         },
  //       },
  //       i: {
  //         e: {
  //           key: 3,
  //           value: "random"
  //         }
  //       }
  //     };

      
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  let ypos = 0, xpos = 1000, xchange = 50, flag = 1;

  const processGraphData = (data) => {
    const newNodes = [];
    const newEdges = [];
    const positions = {};
    const indexMap = topologicalSortWithIndex(data);
    console.log(indexMap);

    // Function to calculate position
    const calculatePosition = (node) => {
      if (!positions[node]) {
        const curr = (flag*xchange);
        positions[node] = { x: xpos+curr, y: 100*indexMap.get(node) };
        console.log(positions[node]);
        console.log(xpos, xchange);
        if(flag == 1) flag = -1;
        else flag = 1;
        ypos += 100;
        xchange += 50;
      }
      return positions[node];
    };


    const getEdgeColor = (key) => {
      switch (key) {
        case 0:
          return 'gray';
        case 1:
          return 'green';
        case 2:
          return 'yellow';
        case 3:
          return 'orange';
        default:
          return 'black';
      }
    };

    Object.keys(data).forEach((source) => {
      if (!newNodes.find((node) => node.id === source)) {
        newNodes.push({ id: source, data: { label: source }, position: calculatePosition(source) });
      }
      Object.keys(data[source]).forEach((target) => {
        if (!newNodes.find((node) => node.id === target)) {
          newNodes.push({ id: target, data: { label: target }, position: calculatePosition(target) });
        }
        const { key, value } = data[source][target];
        console.log(key);
        newEdges.push({
          id: `e${source}-${target}`,
          source,
          target,
          type: CustomEdge,
          label: value,
          markerEnd: {
            type: 'arrow',
          },
          style: { stroke: getEdgeColor(key) }, // Coloring based on key
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div style={{ height: '100vh' }} ref={reactFlowWrapper}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ViewTree;




// import React, { useEffect, useState, useRef } from 'react';
// import ReactFlow, { MiniMap, Controls, Background, ReactFlowProvider } from 'react-flow-renderer';
// import axios from 'axios';
// import CustomEdge from './CustomEdge';

// // Function to perform topological sorting and return a map with indices
// const topologicalSortWithIndex = (graph) => {
//   const visited = new Set();
//   const stack = [];
//   const indexMap = new Map();
  
//   const visit = (node) => {
//     if (visited.has(node)) return;
//     visited.add(node);
//     if (graph[node]) {
//       Object.keys(graph[node]).forEach((neighbor) => visit(neighbor));
//     }
//     stack.push(node);
//   };

//   Object.keys(graph).forEach(visit);
//   const sortedNodes = stack.reverse();
  
//   // Build the index map
//   sortedNodes.forEach((node, index) => {
//     indexMap.set(node, index);
//   });

//   return indexMap;
// };

// const edgeTypes = {
//   custom: CustomEdge,
// };

// const ViewTree = () => {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);
//   const reactFlowWrapper = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/graph-data');
//         const data = response.data;
//         processGraphData(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const processGraphData = (data) => {
//     const newNodes = [];
//     const newEdges = [];
//     const indexMap = topologicalSortWithIndex(data);
//     const positions = {};
//     let yOffset = 0;

//     // Function to calculate position based on index
//     const calculatePosition = (node) => {
//       if (!positions[node]) {
//         positions[node] = { x: 250, y: yOffset + indexMap.get(node) * 100 };
//       }
//       return positions[node];
//     };

//     // Function to determine the edge color based on the key value
//     const getEdgeColor = (key) => {
//       switch (key) {
//         case 0:
//           return 'gray';
//         case 1:
//           return 'green';
//         case 2:
//           return 'yellow';
//         case 3:
//           return 'orange';
//         default:
//           return 'black';
//       }
//     };

//     Object.keys(data).forEach((source) => {
//       if (!newNodes.find((node) => node.id === source)) {
//         newNodes.push({ id: source, data: { label: source }, position: calculatePosition(source) });
//       }
//       if (data[source]) {
//         Object.keys(data[source]).forEach((target) => {
//           if (!newNodes.find((node) => node.id === target)) {
//             newNodes.push({ id: target, data: { label: target }, position: calculatePosition(target) });
//           }
//           const { key, value } = data[source][target];
//           newEdges.push({
//             id: `e${source}-${target}`,
//             source,
//             target,
//             type: 'custom',
//             data: { label: value },
//             style: { stroke: getEdgeColor(key) },
//             markerEnd: {
//               type: 'arrowclosed',
//             },
//           });
//         });
//       }
//     });

//     setNodes(newNodes);
//     setEdges(newEdges);
//   };

//   return (
//     <div style={{ height: '100vh' }} ref={reactFlowWrapper}>
//       <ReactFlowProvider>
//         <ReactFlow nodes={nodes} edges={edges} edgeTypes={edgeTypes} fitView>
//           <MiniMap />
//           <Controls />
//           <Background />
//         </ReactFlow>
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default ViewTree;
