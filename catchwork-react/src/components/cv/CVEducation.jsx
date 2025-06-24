import React from "react"; // React 기본
import YearMonthPicker from "./YearMonthPicker"; // 연-월 전용 date picker
import FormRemoveButton from "./FormRemoveButton"; // x 버튼
import styles from "./CVEducation.module.css"; // 교육 항목 전용 스타일

const CVEducation = ({ index, onRemove, mode, data }) => {
  return (
    <div className={styles.eduSection}>
      <div className={styles.eduInner}>
        <div className={styles.eduInfo}>
          <input
            type="text"
            className={styles.eduInfoInput}
            placeholder="학교명"
            defaultValue={data?.schoolName}
            readOnly={mode === "view"}
          />

          <input
            type="text"
            className={styles.eduInfoInput}
            placeholder="전공"
            defaultValue={data?.major}
            readOnly={mode === "view"}
          />
        </div>

        <div className={styles.eduInfo}>
          <div className={styles.eduRow}>
            <select
              className="info-input"
              defaultValue={data?.schoolType || ""}
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
              defaultValue={data?.status || ""}
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
            <YearMonthPicker value={data?.startDate} onChange={() => {}} />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div className={styles.eduRow}>
            <YearMonthPicker value={data?.endDate} onChange={() => {}} />
          </div>
        </div>

        <FormRemoveButton onClick={onRemove} />
      </div>
    </div>
  );
};

export default CVEducation;
