import React from "react";
import YearMonthPicker from "./YearMonthPicker";
import FormRemoveButton from "./FormRemoveButton";
import styles from "./CVForm01.module.css";

const CVForm01 = ({ type, data, index, onRemove, showRemove, onChange, mode }) => {
  const handleChange = (field, value) => {
    onChange(type, index, field, value);
  };

  return (
    <div className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="text"
            placeholder="자격증/수상명"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="발급기관"
            value={data.issuer || ""}
            onChange={(e) => handleChange("issuer", e.target.value)}
          />
          <YearMonthPicker
            value={data.date || "0000-00"}
            onChange={(val) => handleChange("date", val)}
          />
          
          <FormRemoveButton onClick={onRemove} />
        </div>
      </div>
    </div>
  );
};

export default CVForm01;