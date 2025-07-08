import React, { useEffect, useState } from "react";
import YearMonthPicker from "./YearMonthPicker"; // 연-월 선택 컴포넌트
import FormRemoveButton from "./FormRemoveButton"; // x 버튼
import styles from "./CVLanguage.module.css"; // 스타일

// 어학 입력 컴포넌트
const CVLanguage = ({ index, onRemove, showRemove, data, onChange, mode, isSubmitted }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!data.language?.trim()) {
      setError("언어명을 입력해주세요.");
    } else if (data.language.length > 20) {
      setError("언어명은 최대 20자까지 입력 가능합니다.");
    } else if (!data.exam?.trim()) {
      setError("시험명을 입력해주세요.");
    } else if (data.exam.length > 20) {
      setError("시험명은 최대 20자까지 입력 가능합니다.");
    } else if (!data.score?.trim()) {
      setError("점수를 입력해주세요.");
    } else if (!/^\d+$/.test(data.score)) {
      setError("점수는 숫자만 입력 가능합니다.");
    } else if (data.score.length > 5) {
      setError("점수는 최대 5자리까지 입력 가능합니다.");
    } else if (!data.date) {
      setError("취득일자를 입력해주세요.");
    } else {
      setError("");
    }
  }, [data]);

  return (
    <div className={styles.section}>
      {mode !== "view" &&  mode !== "submit" && (
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
        <YearMonthPicker
          mode={mode}
          value={data.date || ""}
          onChange={(val) => onChange("language", index, "date", val)}
        />
      </div>
      {isSubmitted && error && <div className="regex">{error}</div>}
    </div>
  );
};

export default CVLanguage;
