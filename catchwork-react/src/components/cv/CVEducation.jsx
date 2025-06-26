import React from "react"; // React 기본
import YearMonthPicker from "./YearMonthPicker"; // 연-월 전용 date picker
import styles from "./CVEducation.module.css"; // 교육 항목 전용 스타일

const CVEducation = ({ formData, onChange, mode }) => {
  return (
    <div className={styles.eduSection}>
      <div className={styles.eduInner}>
        <div className={styles.eduInfo}>
          <input
            type="text"
            className={styles.eduInfoInput}
            placeholder="학교명"
            value={formData.eduName || ""}
            onChange={(e) => onChange("eduName", e.target.value)}
            readOnly={mode === "view"}
          />
          <input
            type="text"
            className={styles.eduInfoInput}
            placeholder="전공"
            value={formData.eduMajor || ""}
            onChange={(e) => onChange("eduMajor", e.target.value)}
            readOnly={mode === "view"}
          />
        </div>

        <div className={styles.eduInfo}>
          <div className={styles.eduRow}>
            <select
              className="info-input"
              value={formData.eduCodeNo || ""}
              onChange={(e) => onChange("eduCodeNo", e.target.value)}
              disabled={mode === "view"}
            >
              <option value="">학위</option>
              <option value="0">고졸</option>
              <option value="1">전문학사</option>
              <option value="2">학사</option>
              <option value="3">석사</option>
              <option value="4">박사</option>
            </select>
          </div>

          <div className={styles.eduRow}>
            <select
              className="info-input"
              value={formData.eduStatusCodeNo || ""}
              onChange={(e) => onChange("eduStatusCodeNo", e.target.value)}
              disabled={mode === "view"}
            >
              <option value="">학력 상태</option>
              <option value="0">졸업</option>
              <option value="1">졸업예정</option>
              <option value="2">수료</option>
              <option value="3">재학</option>
              <option value="4">휴학</option>
              <option value="5">중퇴</option>
              <option value="6">자퇴</option>
            </select>
          </div>

          <div className={styles.eduRow}>
            <YearMonthPicker
              value={formData.eduStartDate  || ""}
              onChange={(val) => onChange("eduStartDate", val)}
            />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div className={styles.eduRow}>
            <YearMonthPicker
              value={formData.eduEndDate || ""}
              onChange={(val) => onChange("eduEndDate", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEducation;
