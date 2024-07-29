


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConditionRow from "./ConditionRow";
import axios from "axios";

const ConditionList = () => {
  const [rows, setRows] = useState([{}]);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const navigate = useNavigate();

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
    return rows.every((row) => {
      if (row.firstDropdown === "Name")
        return /^[A-Za-z]+$/.test(row.textBoxValue);
      if (row.firstDropdown === "Age")
        return /^(lesser|greater) than \d+$/.test(row.textBoxValue);
      if (row.firstDropdown === "Gender")
        return ["male", "female"].includes(row.textBoxValue.toLowerCase());
      if (row.firstDropdown === "Pincode") {
        // Allow pincode to be exactly 6 digits or start with 2 digits followed by more digits, with total length >= 6
        return /^\d{2}\d*$/.test(row.textBoxValue) || /^\d{6}$/.test(row.textBoxValue);
      }
      return false;
      // }) && rows.every((row) => row.secondDropdown !== "")
    });
  };

  const handleSaveClick = async () => {
    console.log(rows);
    if (validateRows()) {
      const workflow = {
        name: "workflow1", // Change this to a dynamic value if needed
        steps: rows.map((row) => ({
          action: row.action,
          condition: row.condition,
          activity: row.activity,
        })),
      };

      try {
        const response = await axios.post(
          "http://localhost:8080/workflows",
          workflow
        );
        setSaveMessage("Workflow saved successfully!");
        setError("");
      } catch (error) {
        setError("Error saving workflow. Please try again.");
      }
    } else {
      setError("Please fill in all fields correctly before saving.");
    }
  };

  const handleRedirect = () => {
    navigate("/view-workflows");
  };

  return (
    <div className="condition-list-container">
      <h1>Workflow Parameters</h1>
      {rows.map((_, index) => (
        <ConditionRow
          key={index}
          index={index}
          onConditionChange={handleConditionChange}
        />
      ))}
      <div>
        <button className="button" onClick={addRow}>
          Add Condition
        </button>
        <button className="button" onClick={handleSaveClick}>
          Save Workflow
        </button>
        <button className="button" onClick={handleRedirect}>
          View Workflows
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {saveMessage && <div className="success-message">{saveMessage}</div>}
    </div>
  );
};

export default ConditionList;
