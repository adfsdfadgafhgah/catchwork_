import React from "react"; // React 기본
import YearMonthPicker from "./YearMonthPicker"; // 연-월 전용 date picker
import FormRemoveButton from "./FormRemoveButton"; // x 버튼
import styles from "./CVEducation.module.css"; // 교육 항목 전용 스타일

const CVEducation = ({ index, type, onRemove, data, onChange, mode }) => {
  const handleChange = (field, value) => {
    onChange(type, index, field, value);
  };
  return (
    <div className={styles.eduSection}>
      <div className={styles.eduInner}>
        <div className={styles.eduInfo}>
          <input
            type="text"
            className={styles.eduInfoInput}
            placeholder="학교명"
            value={data?.schoolName || ""}
            onChange={(e) => handleChange("schoolName", e.target.value)}
            readOnly={mode === "view"}
          />
          <input
            type="text"
            className={styles.eduInfoInput}
            placeholder="전공"
            value={data?.major || ""}
            onChange={(e) => handleChange("major", e.target.value)}
            readOnly={mode === "view"}
          />
        </div>

        <div className={styles.eduInfo}>
          <div className={styles.eduRow}>
            <select
              className="info-input"
              value={data?.schoolType || ""}
              onChange={(e) => handleChange("schoolType", e.target.value)}
              disabled={mode === "view"}
            >
              <option value="">학위</option>
              <option value="초등학교">초등학교</option>
              <option value="중학교">중학교</option>
              <option value="고등학교">고등학교</option>
              <option value="대학교">대학교</option>
              <option value="대학원">대학원</option>
            </select>
          </div>

          <div className={styles.eduRow}>
            <select
              className="info-input"
              value={data?.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
              disabled={mode === "view"}
            >
              <option value="">학력 상태</option>
              <option value="재학">재학</option>
              <option value="졸업예정">졸업예정</option>
              <option value="졸업">졸업</option>
              <option value="중퇴">중퇴</option>
            </select>
          </div>

          <div className={styles.eduRow}>
            <YearMonthPicker
              mode={mode}
              value={data?.startDate || ""}
              onChange={(val) => handleChange("startDate", val)}
            />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div className={styles.eduRow}>
            <YearMonthPicker
              mode={mode}
              value={data?.endDate || ""}
              onChange={(val) => handleChange("endDate", val)}
            />
          </div>
        </div>

        <FormRemoveButton onClick={onRemove} />
      </div>
    </div>
  );
};

export default CVEducation;
