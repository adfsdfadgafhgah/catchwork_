// src/components/cv/CVForm02.jsx
import React from "react";
import YearMonthPicker from "./YearMonthPicker";
import FormRemoveButton from "./FormRemoveButton";
import styles from "./CVForm02.module.css";

const CVForm02 = ({ index, onRemove, mode, data, labels, type, onChange }) => {
  const handleChange = (field, value) => {
    onChange(type, index, field, value);
  };

  return (
    <div className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <input
            type="text"
            placeholder={labels.name}
            value={data.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className={styles.input}
          />
          <div className={styles.dateRow}>
            <YearMonthPicker
              value={data.startDate || ""}
              onChange={(val) => handleChange("startDate", val)}
            />
            <span className={styles.dateDash}>-</span>
            <YearMonthPicker
              value={data.endDate || ""}
              onChange={(val) => handleChange("endDate", val)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <textarea
            placeholder={labels.description}
            value={data.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className={styles.textarea}
          />
        </div>

        <FormRemoveButton onClick={onRemove} />
      </div>
    </div>
  );
};


export default CVForm02;
