// src/components/cv/CVEducation.jsx
import React from "react"; // React 기본
import YearMonthPicker from "./YearMonthPicker"; // 연-월 전용 date picker
import FormRemoveButton from "./FormRemoveButton"; // x 버튼
import styles from "./CVEducation.module.css"; // 교육 항목 전용 스타일

const CVEducation = ({ index, onRemove, showRemove, mode, data }) => {
  return (
    <div className={styles.eduSection}>
      <div className={styles.eduInner}>
        <h4 className={styles.eduTitle}>학력 #{index + 1}</h4>

        <input
          type="text"
          className="info-input"
          placeholder="학교명"
          defaultValue={data?.schoolName}
          readOnly={mode === "view"}
        />

        <input
          type="text"
          className="info-input"
          placeholder="전공"
          defaultValue={data?.major}
          readOnly={mode === "view"}
        />

        <div className={styles.eduRow}>
          <label className={styles.eduLabel}>입학일</label>
          <YearMonthPicker
            value={data?.startDate}
            onChange={() => {}}
          />
        </div>

        <div className={styles.eduRow}>
          <label className={styles.eduLabel}>졸업일</label>
          <YearMonthPicker
            value={data?.endDate}
            onChange={() => {}}
          />
        </div>

        <div className={styles.eduRow}>
          <label className={styles.eduLabel}>학교 구분</label>
          <select className="info-input" defaultValue={data?.schoolType || ""} disabled={mode === "view"}>
            <option value="">선택</option>
            <option value="초등학교">초등학교</option>
            <option value="중학교">중학교</option>
            <option value="고등학교">고등학교</option>
            <option value="대학교">대학교</option>
            <option value="대학원">대학원</option>
          </select>
        </div>

        <div className={styles.eduRow}>
          <label className={styles.eduLabel}>졸업 상태</label>
          <select className="info-input" defaultValue={data?.status || ""} disabled={mode === "view"}>
            <option value="">선택</option>
            <option value="재학">재학</option>
            <option value="졸업예정">졸업예정</option>
            <option value="졸업">졸업</option>
            <option value="중퇴">중퇴</option>
          </select>
        </div>

        {/* 수정/작성 모드일 때만 삭제 버튼 보이게 */}
        {/* {mode !== "view" && showRemove && <FormRemoveButton onClick={onRemove} />} */}
        <FormRemoveButton onClick={onRemove} />
      </div>
    </div>
  );
};

export default CVEducation;
