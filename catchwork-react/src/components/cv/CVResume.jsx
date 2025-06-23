import React from "react";
import styles from "./CVResume.module.css";

const CVResume = ({ value, onChange }) => {
  return (
    <div className="section">
      <h2 className="section-title">자기소개서</h2>
      <textarea
        className={styles.selfIntroduction}
        placeholder="자기소개서 내용"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CVResume;
