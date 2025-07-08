import React, { useEffect, useState } from "react"; // React 기본
import styles from "./CVTitle.module.css";

const CVTitle = ({ value, onChange, isSubmitted }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.length > 30) {
      setError("이력서 제목은 최대 30자까지 입력 가능합니다.");
    } else if (!value.trim()) {
      setError("이력서 제목을 입력해주세요.");
    } else {
      setError("");
    }
  }, [value]);

  return (
    <>
      <div className={`${styles.infoItem} ${styles.fullWidth}`}>
        <input
          type="text"
          className={styles.infoInput}
          placeholder="이력서 이름"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {isSubmitted && error && <div className="regex">{error}</div>}
    </>
  );
};

export default CVTitle;
