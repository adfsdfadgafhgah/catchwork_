import React from "react";
import YearMonthPicker from "./YearMonthPicker"; // 연-월 선택 컴포넌트
import FormRemoveButton from "./FormRemoveButton"; // x 버튼
import styles from "./CVLanguage.module.css"; // 스타일

// 어학 입력 컴포넌트
const CVLanguage = ({ index, onRemove, showRemove, data, onChange, mode }) => {
  return (
    <div className={styles.section}>
      {mode !== "view" && (
        <FormRemoveButton onClick={onRemove} />
      )}
      <div className={styles.inner}>
        {/* 언어명 */}
        <div className={styles.row}>
          <input
            type="text"
            placeholder="언어명"
            className={styles.input}
            value={data.language || ""}
            onChange={(e) => onChange("language", index, "language", e.target.value)}
          />
          {showRemove && <FormRemoveButton onClick={onRemove} />}
        </div>

        {/* 시험명 */}
        <div className={styles.row}>
          <input
            type="text"
            placeholder="시험명"
            className={styles.input}
            value={data.exam || ""}
            onChange={(e) => onChange("language", index, "exam", e.target.value)}
          />
        </div>

        {/* 점수 */}
        <div className={styles.row}>
          <input
            type="text"
            placeholder="점수"
            className={styles.input}
            value={data.score || ""}
            onChange={(e) => onChange("language", index, "score", e.target.value)}
          />
        </div>

        {/* 취득 날짜 */}
        <div className={styles.row}>
          <YearMonthPicker
            mode={mode}
            value={data.date || ""}
            onChange={(val) => onChange("language", index, "date", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default CVLanguage;
