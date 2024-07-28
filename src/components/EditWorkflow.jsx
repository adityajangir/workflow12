// src/components/EditWorkflow.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ConditionRow from "./ConditionRow";

const EditWorkflow = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { workflow } = location.state;

  useEffect(() => {
    if (workflow) {
      setRows(workflow.steps);
    }
  }, [workflow]);

  const addRow = () => {
    setRows((prevRows) => [...prevRows, {}]);
    setError("");
  };

  const handleConditionChange = (index, condition) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = condition;
      return updatedRows;
    });
  };

  const validateRows = () => {
    return true;
    // Add your validation logic here
  };

  const handleUpdateClick = async () => {
    if (validateRows()) {
      const updatedWorkflow = {
        ...workflow,
        steps: rows,
      };

      try {
        const response = await axios.put(
          `http://localhost:8080/workflows/${workflow.id}`,
          updatedWorkflow
        );
        setSaveMessage("Workflow updated successfully!");
        setError("");
        navigate("/view-workflows");
      } catch (error) {
        setError("Error updating workflow. Please try again.");
      }
    } else {
      setError("Please fill in all fields correctly before saving.");
    }
  };

  return (
    <div className="condition-list-container">
      <h1>Edit Workflow</h1>
      {rows.map((row, index) => (
        <ConditionRow
          key={index}
          index={index}
          onConditionChange={handleConditionChange}
          prefill={row}
        />
      ))}
      <div>
        <button className="button" onClick={addRow}>
          Add Condition
        </button>
        <button className="button" onClick={handleUpdateClick}>
          Update Workflow
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {saveMessage && <div className="success-message">{saveMessage}</div>}
    </div>
  );
};

export default EditWorkflow;
