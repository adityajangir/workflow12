// // src/components/ConditionList.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
// import ConditionRow from "./ConditionRow";
// import "./ConditionList.css"; // Correct CSS file import
// import axios from "axios"; // Make sure axios is installed

// const ConditionList = () => {
//   const [rows, setRows] = useState([{}]);
//   const [error, setError] = useState("");
//   const [saveMessage, setSaveMessage] = useState("");
//   const navigate = useNavigate(); // Hook to handle navigation

//   const addRow = () => {
//     setRows((prevRows) => [...prevRows, {}]);
//     setError(""); // Clear any previous errors
//   };

//   const handleConditionChange = (index, condition) => {
//     setRows((prevRows) => {
//       const updatedRows = [...prevRows];
//       updatedRows[index] = condition;
//       return updatedRows;
//     });
//   };

//   const validateRows = () => {
//     return (
//       rows.every((row) => {
//         if (row.firstDropdown === "Name")
//           return /^[A-Za-z]+$/.test(row.textBoxValue);
//         if (row.firstDropdown === "Age")
//           return /^(lesser|greater) than \d+$/.test(row.textBoxValue);
//         if (row.firstDropdown === "Gender")
//           return ["male", "female"].includes(row.textBoxValue.toLowerCase());
//         if (row.firstDropdown === "Pincode")
//           return /^\d{6}$/.test(row.textBoxValue);
//         return false;
//       }) && rows.every((row) => row.secondDropdown !== "")
//     );
//   };

//   const handleAddClick = () => {
//     if (validateRows()) {
//       addRow();
//     } else {
//       setError("Please fill in all fields correctly for each condition.");
//     }
//   };

//   const handleSaveClick = async () => {
//     console.log(rows);
//     if (validateRows()) {
//       try {
//         const response = await axios.post("/api/save-workflow", {
//           conditions: rows,
//         });
//         setSaveMessage(response.data.message);
//         setError(""); // Clear any previous errors
//       } catch (error) {
//         setError("Error saving workflow. Please try again.");
//       }
//     } else {
//       setError("Please fill in all fields correctly before saving.");
//     }
//   };

//   const handleRedirect = () => {
//     navigate("/view-workflows"); // Redirect to the view workflows page
//   };

//   return (
//     <div className="condition-list-container">
//       <h1>Workflow Parameters</h1>
//       {rows.map((_, index) => (
//         <ConditionRow
//           key={index}
//           index={index}
//           onConditionChange={handleConditionChange}
//         />
//       ))}
//       <div>
//         <button className="button" onClick={handleAddClick}>
//           Add Condition
//         </button>
//         <button className="button" onClick={handleSaveClick}>
//           Save Workflow
//         </button>
//         <button className="button" onClick={handleRedirect}>
//           View Workflows
//         </button>{" "}
//         {/* New button */}
//       </div>
//       {error && <div className="error-message">{error}</div>}
//       {saveMessage && <div className="success-message">{saveMessage}</div>}
//     </div>
//   );
// };

// export default ConditionList;

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
      if (row.firstDropdown === "Pincode")
        return /^\d{6}$/.test(row.textBoxValue);
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
