import React from "react"; // React 기본
import styles from "./CVTitle.module.css";

const CVTitle = ({ value, onChange }) => {
  return (
    <div className={`${styles.infoItem} ${styles.fullWidth}`}>
      <input
        type="text"
        className={styles.infoInput}
        placeholder="이력서 이름"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CVTitle;
