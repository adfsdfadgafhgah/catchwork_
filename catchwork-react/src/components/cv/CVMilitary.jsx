import React from "react";
import YearMonthPicker from "./YearMonthPicker";
import styles from "./CVMilitary.module.css";

const CVMilitary = ({ formData, onChange }) => {
  return (
    <>
      <h2 className="writeCVSection-title">병역</h2>
      <div className={styles.section}>

        {/* 병역 구분 & 군별 */}
        <div className={styles.militaryRow}>
          <select
            className={styles.militarySelect}
            value={formData.militaryStatus}
            onChange={(e) => onChange("militaryStatus", e.target.value)}
          >
            <option value="">구분</option>
            <option value="군필">군필</option>
            <option value="미필">미필</option>
            <option value="면제">면제</option>
          </select>

          <select
            className={styles.militarySelect}
            value={formData.militaryBranch}
            onChange={(e) => onChange("militaryBranch", e.target.value)}
          >
            <option value="">군별</option>
            <option value="육군">육군</option>
            <option value="해군">해군</option>
            <option value="공군">공군</option>
          </select>
        </div>

        {/* 입대일 ~ 전역일 */}
        <div className={styles.militaryDates}>
          <YearMonthPicker
            value={formData.militaryStartDate}
            onChange={(val) => onChange("militaryStartDate", val)}
          />
          <span className={styles.dateSeparator}>~</span>
          <YearMonthPicker
            value={formData.militaryEndDate}
            onChange={(val) => onChange("militaryEndDate", val)}
          />
        </div>
      </div>
    </>
  );
};

export default CVMilitary;
