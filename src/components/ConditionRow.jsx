
import React, { useState, useEffect } from "react";
import "./ConditionRow.css";

const ConditionRow = ({ index, onConditionChange, prefill }) => {
  const [firstDropdown, setFirstDropdown] = useState(prefill?.Action || "");
  const [textBoxValue, setTextBoxValue] = useState(prefill?.Condition || "");
  const [secondDropdown, setSecondDropdown] = useState(prefill?.Activity || "");

  const parameters1 = ["Name", "AgeCheck", "GenderCheck", "PincodeCheck"];
  const parameters2 = ["Name", "AgeCheck", "GenderCheck", "PincodeCheck", "LoanStatus"];

  const validateTextBoxValue = () => {
    if (firstDropdown === "Name") {
      return /^[A-Za-z]+$/.test(textBoxValue);
    } else if (firstDropdown === "AgeCheck") {
      // return true;
      return /^age[<>]\d+(\s+or\s+age[<>]\d+)?$/.test(textBoxValue);      // change  age>25, age<30
    } else if (firstDropdown === "GenderCheck") {
      return ["male", "female"].includes(textBoxValue.toLowerCase());
    } else if (firstDropdown === "PincodeCheck") {
      // Allow pincode to be exactly 6 digits or start with 2 digits followed by more digits, with total length >= 6
      // return /^\d{2}\d*$/.test(textBoxValue) || /^\d{6}$/.test(textBoxValue);
    }
    return true;
  };

  useEffect(() => {
    if (validateTextBoxValue()) {
      onConditionChange(index, {
        Action: firstDropdown,
        Condition: textBoxValue,
        Activity: secondDropdown,
      });
    }
  }, [firstDropdown, textBoxValue, secondDropdown, index]);

  const getPlaceholder = () => {
    if (firstDropdown === "AgeCheck") return "age>30 or age<45";
    if (firstDropdown === "GenderCheck") return "male or female";
    if (firstDropdown === "PincodeCheck") return "6-digit PIN code or Start with XX";
    return "";
  };

  return (
    <div className="condition-row">
      <select
        value={firstDropdown}
        onChange={(e) => setFirstDropdown(e.target.value)}
      >
        <option value="">Select Parameter</option>
        {parameters1.map((param) => (
          <option key={param} value={param}>
            {param}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={textBoxValue}
        onChange={(e) => setTextBoxValue(e.target.value)}
        placeholder={getPlaceholder()}
      />
      <select
        value={secondDropdown}
        onChange={(e) => setSecondDropdown(e.target.value)}
      >
        <option value="">Select Parameter</option>
        {parameters2.map((param) => (
          <option key={param} value={param}>
            {param}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ConditionRow;

