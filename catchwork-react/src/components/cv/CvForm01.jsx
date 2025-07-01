import React from "react";
import YearMonthPicker from "./YearMonthPicker";
import FormRemoveButton from "./FormRemoveButton";
import styles from "./CVForm01.module.css";

                //  번호  종류(수상) 값   제목    삭제버튼    변경
const CVForm01 = ({ index, type, data, labels, onRemove, onChange, mode }) => {
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
            placeholder={labels.title}
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder={labels.name}
            value={data.issuer || ""}
            onChange={(e) => handleChange("issuer", e.target.value)}
          />
          <YearMonthPicker
            mode={mode}
            value={data.date || "0000-00"}
            onChange={(val) => handleChange("date", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default CVForm01;