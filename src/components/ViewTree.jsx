// src/components/ViewTree.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow, { ReactFlowProvider, addEdge, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import './ViewTree.css';

const ViewTree = ({ match }) => {
  const [elements, setElements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkflowJsonData = async () => {
      try {
        const response = await axios.get(`/api/get-workflow-json/${match.params.workflowId}`);
        generateElements(response.data.workflow, response.data.jsonData);
      } catch (error) {
        setError('Error fetching workflow and JSON data.');
      }
    };
    fetchWorkflowJsonData();
  }, [match.params.workflowId]);

  const generateElements = (workflow, jsonData) => {
    const newElements = [];
    const generateElement = (node, parentId = null) => {
      const nodeId = `${parentId ? `${parentId}-` : ''}${newElements.length}`;
      const isSatisfied = jsonData[node.name] !== undefined; // Check if the JSON data satisfies the node
      newElements.push({
        id: nodeId,
        data: { label: node.name || 'Unnamed Node' },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        style: { backgroundColor: isSatisfied ? 'green' : 'grey' }, // Set color based on satisfaction
      });
      if (parentId) {
        newElements.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
        });
      }
      if (node.children) {
        node.children.forEach((child) => generateElement(child, nodeId));
      }
    };
    generateElement(workflow);
    setElements(newElements);
  };

  return (
    <div className="view-tree-container">
      <h1>Workflow Tree</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="react-flow-wrapper" style={{ height: '80vh', width: '100%' }}>
        <ReactFlowProvider>
          <ReactFlow
            elements={elements}
            style={{ width: '100%', height: '100%' }}
            snapToGrid={true}
            snapGrid={[15, 15]}
            onConnect={(params) => setElements((els) => addEdge(params, els))}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap nodeColor={(node) => {
              switch (node.type) {
                case 'input':
                  return 'blue';
                case 'output':
                  return 'green';
                default:
                  return '#00ff00';
              }
            }} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ViewTree;
