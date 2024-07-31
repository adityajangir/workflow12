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

  const removeEmptyKey = (obj) => {
    Object.keys(obj).forEach(key => {
      if (key === '') {
        delete obj[key];
      }
    });
    return obj;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dataParam = queryParams.get('data');
    if (dataParam) {
      try {
        // Decoding and parsing the graph data
        const graphData = JSON.parse(decodeURIComponent(dataParam));
        const newgraphData = removeEmptyKey(graphData.data);
        console.log(newgraphData)
        processGraphData(newgraphData);
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
    
    // Building the index map
    sortedNodes.forEach((node, index) => {
      indexMap.set(node, index);
    });

    return indexMap;
  };





  // const updateSubtreeValue = (graph, nodex) => {
  //   const result = JSON.parse(JSON.stringify(graph));
  
  //   const updateSubtreeRecursive = (node, value) => {
  //     console.log(node, value);
      
  //     Object.keys(result[node]).forEach((target) => {
  //         if (value == 0 || result[node][target].key == 0) {
  //           result[node][target].key = 0;
  //           updateSubtreeRecursive(target, 0);
  //         } else {
  //           updateSubtreeRecursive(target, result[node][target].key);
  //         }
  //     });
  //   };
  
  //   updateSubtreeRecursive(nodex, 1);
  //   console.log(result);
  //   return result;
  // };


  
  const updateSubtreeValue = (graph, nodex) => {
    const result = JSON.parse(JSON.stringify(graph));
  
    const updateSubtreeRecursive = (node, value) => {
      // Ensure the node exists in the result object
      if (!result[node]) {
        return;
      }
      
      // Iterate over the keys of the current node
      Object.keys(result[node]).forEach((target) => {
        // Ensure the target exists and has a key
        if (value == 0 || result[node][target].key == 0) {
          result[node][target].key = 0;
          updateSubtreeRecursive(target, 0);
        } else {
          updateSubtreeRecursive(target, result[node][target].key);
        }
      });
    };
  
    updateSubtreeRecursive(nodex, 1);
    console.log(result);
    return result;
  };
  




  let ypos = 0, xpos = 1000, xchange = 50, flag = 1;

  function findFirstOccurrence(map, value) {
    let foundKey = undefined;
  
    map.forEach((val, key) => {
      if (foundKey === undefined && val === value) {
        foundKey = key;
      }
    });
  
    return foundKey;
  }

  const processGraphData = (data1) => {
    const newNodes = [];
    const newEdges = [];
    const positions = {};
    const indexMap = topologicalSortWithIndex(data1);
    const firstoccactivity = findFirstOccurrence(indexMap, 0);
    console.log(firstoccactivity)
    const data = updateSubtreeValue(data1, firstoccactivity);
    console.log(data);
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
      if(source != ""){
        if (!newNodes.find((node) => node.id === source)) {
          newNodes.push({ id: source, data: { label: source }, position: calculatePosition(source) });
        }
        Object.keys(data[source]).forEach((target) => {
          if(target!=""){
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
          }
        });

      }
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



