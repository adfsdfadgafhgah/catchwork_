// src/components/cv/CVForm02.jsx
import React, { useEffect, useState } from "react";
import YearMonthPicker from "./YearMonthPicker";
import FormRemoveButton from "./FormRemoveButton";
import styles from "./CVForm02.module.css";

                //  번호  종류(경력) 값   제목    삭제버튼    변경
const CVForm02 = ({ index, type, data, labels, onRemove, onChange, mode, isSubmitted }) => {
  const handleChange = (field, value) => {
    onChange(type, index, field, value);
  };

  const [error, setError] = useState("");

  useEffect(() => {
    if (!data.name?.trim()) {
      setError(`${labels.name}을 입력해주세요.`);
    } else if (data.name.length > 20) {
      setError(`${labels.name}은 최대 20자까지 입력 가능합니다.`);
    } else if (type !== "portfolio" && !data.org?.trim()) {
      setError(`${labels.org}을 입력해주세요.`);
    } else if (type !== "portfolio" && data.org?.length > 20) {
      setError(`${labels.org}은 최대 20자까지 입력 가능합니다.`);
    } else if (!data.startDate || !data.endDate) {
      setError("기간을 입력해주세요.");
    } else if (data.description?.length > 1000) {
      setError("설명은 최대 1000자까지 입력 가능합니다.");
    } else {
      setError("");
    }
  }, [data]);
  
  return (
    <div className={styles.section}>
      {mode !== "view" && mode !== "submit" && (
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
            <span className={styles.dateDash}>~</span>
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
      {isSubmitted && error && <div className="regex">{error}</div>}
    </div>
  );
};


export default CVForm02;
