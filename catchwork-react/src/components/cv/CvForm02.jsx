// src/components/cv/CVForm02.jsx
import React from "react";
import YearMonthPicker from "./YearMonthPicker";
import FormRemoveButton from "./FormRemoveButton";
import styles from "./CVForm02.module.css";

                //  번호  종류(경력) 값   제목    삭제버튼    변경
const CVForm02 = ({ index, type, data, labels, onRemove, onChange, mode }) => {
  const handleChange = (field, value) => {
    onChange(type, index, field, value);
  };

  return (
    <div className={styles.section}>
      {mode !== "view" && (
        <FormRemoveButton onClick={onRemove} />
      )}
      <div className={styles.inner}>
        <div className={styles.row}>
          <input
            className={styles.input}
            type="text"
            placeholder={labels.name}
            value={data.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <div className={styles.dateRow}>
            <YearMonthPicker
              mode={mode}
              value={data.startDate || ""}
              onChange={(val) => handleChange("startDate", val)}
            />
            <span className={styles.dateDash}>-</span>
            <YearMonthPicker
              mode={mode}
              value={data.endDate || ""}
              onChange={(val) => handleChange("endDate", val)}
            />
          </div>
        </div>
        {type !== "portfolio" && ( // 포폴이 아닌경우 경우에만 렌더
          <div className={styles.row}>
            <input
              className={styles.input}
              type="text"
              placeholder={labels.org}
              value={data.org || ""}
              onChange={(e) => handleChange("org", e.target.value)}
            />
          </div>
        )}
        <div className={styles.row}>
          <textarea
            placeholder={labels.description}
            value={data.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className={styles.textarea}
          />
        </div>
      </div>
    </div>
  );
};


export default CVForm02;
