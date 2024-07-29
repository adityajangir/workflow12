import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewWorkflows.css';

const ViewWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [jsonInput, setJsonInput] = useState('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get("http://localhost:8080/workflows");
        setWorkflows(response.data);
      } catch (error) {
        setError('Error fetching workflows.');
      }
    };
    fetchWorkflows();
  }, []);

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSaveJson = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      console.log(parsedData)
      // const parsedData = jsonInput;
      const graph = await axios.post(`http://localhost:8080/execution/start/${selectedWorkflowId}`, parsedData);
      setSuccessMessage('JSON data saved successfully!');
      setError('');
      const serializedData = encodeURIComponent(JSON.stringify(graph));
      navigate(`/view-tree?data=${serializedData}`);
    } catch (error) {
      setError('Invalid JSON data or error saving JSON.', error);
      setSuccessMessage('');
    }
  };

  const handleDeleteWorkflow = async () => {
    try {
      await axios.delete(`http://localhost:8080/workflows/${selectedWorkflowId}`);
      setWorkflows(workflows.filter(workflow => workflow.id !== selectedWorkflowId));
      setSelectedWorkflowId('');
      setSuccessMessage('Workflow deleted successfully!');
      setError('');
    } catch (error) {
      setError('Error deleting workflow.', error);
      setSuccessMessage('');
    }
  };

// src/components/ViewWorkflows.jsx
const handleEditWorkflow = () => {
  const selectedWorkflow = workflows.find(workflow => workflow.id === selectedWorkflowId);
  if (selectedWorkflow) {
    navigate(`/edit-workflow/${selectedWorkflowId}`, { state: { workflow: selectedWorkflow } });
  }
};



  return (
    <div className="view-workflows-container">
      <h1>View Workflows</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="workflows-list">
        <h2>Existing Workflows:</h2>
        <select
          value={selectedWorkflowId}
          onChange={(e) => setSelectedWorkflowId(e.target.value)}
        >
          <option value="">Select a workflow</option>
          {workflows.map(workflow => (
            <option key={workflow.id} value={workflow.id}>
              {workflow.name}
            </option>
          ))}
        </select>
        <button className="button" onClick={handleDeleteWorkflow} disabled={!selectedWorkflowId}>Delete</button>
        <button className="button" onClick={handleEditWorkflow} disabled={!selectedWorkflowId}>Edit</button>
      </div>
      <div className="json-input-container">
        <h2>Input JSON Data:</h2>
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='Enter JSON here...'
          rows="10"
          cols="50"
        />
        <button className="button" onClick={handleSaveJson}>Save JSON</button>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default ViewWorkflows;
