import React, { useEffect, useState } from "react";
import YearMonthPicker from "./YearMonthPicker";
import styles from "./CVMilitary.module.css";

const CVMilitary = ({ formData, onChange, isSubmitted }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!formData.cvMiliClass || !formData.cvMiliBranch) {
      setError("모든 병역 정보를 입력해주세요.");
    } else {
      if (formData.cvMiliClass === "군필") {
        if (!formData.cvMiliStartDate || !formData.cvMiliEndDate) {
          setError("병역 기간을 입력해주세요.");
          return;
        }
      }
      setError("");
    }
  }, [formData]);

  return (
    <>
      <h2 className="writeCVSection-title">병역</h2>
      <div className={styles.section}>
        <div className={styles.militaryLeft}>
          {/* 병역 구분 & 군별 */}
          <div className={styles.militaryRow}>
            <select
              className={styles.militarySelect}
              value={formData.cvMiliClass}
              onChange={(e) => {
                const value = e.target.value;
                onChange("cvMiliClass", value);
                // 군필이 아니면 군별 값은 "-"로 고정
                if (value !== "군필") {
                  onChange("cvMiliBranch", "-");
                }
              }}
            >
              <option value="">구분</option>
              <option value="군필">군필</option>
              <option value="미필">미필</option>
              <option value="면제">면제</option>
            </select>
          </div>
          <div className={styles.militaryRow}>
            <select
              className={styles.militarySelect}
              value={formData.cvMiliBranch}
              onChange={(e) => onChange("cvMiliBranch", e.target.value)}
              disabled={formData.cvMiliClass !== "군필"}
            >
              {formData.cvMiliClass === "미필" ||
              formData.cvMiliClass === "면제" ? (
                <option value="-">-</option>
              ) : (
                <>
                  <option value="">군별</option>
                  <option value="육군">육군</option>
                  <option value="해군">해군</option>
                  <option value="공군">공군</option>
                  <option value="사회복무요원">사회복무요원</option>
                  <option value="산업기능요원">산업기능요원</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className={styles.militaryRight}>
          {formData.cvMiliClass === "군필" && (
            <>
              {/* 입대일 ~ 전역일 */}
              <div>
                <YearMonthPicker
                  value={formData.cvMiliStartDate}
                  onChange={(val) => onChange("cvMiliStartDate", val)}
                />
              </div>

              <span className={styles.dateSeparator}>~</span>

              <div>
                <YearMonthPicker
                  value={formData.cvMiliEndDate}
                  onChange={(val) => onChange("cvMiliEndDate", val)}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.militaryWoman}>
        <span>여성은 면제 선택</span>
      </div>
      {isSubmitted && error && <div className="regex">{error}</div>}
    </>
  );
};

export default CVMilitary;
