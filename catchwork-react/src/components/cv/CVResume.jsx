import React, { useEffect, useState } from "react";
import styles from "./CVResume.module.css";

const CVResume = ({ formData, onChange, isSubmitted }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (formData.cvResume?.length > 2000) {
      setError("자기소개서는 최대 2000자까지 작성할 수 있습니다.");
    } else {
      setError("");
    }
  }, [formData.cvResume]);

  return (
    <>
      <div className="section">
        <h2 className="section-title">자기소개서</h2>
        <textarea
          className={styles.selfIntroduction}
          placeholder="자기소개서 내용"
          value={formData.cvResume}
          onChange={(e) => onChange("cvResume", e.target.value)}
        />
      </div>
      {isSubmitted && error && <div className="regex">{error}</div>}
    </>
  );
};

export default CVResume;
