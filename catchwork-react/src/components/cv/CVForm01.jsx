import React, { useEffect, useState } from "react";
import YearMonthPicker from "./YearMonthPicker";
import FormRemoveButton from "./FormRemoveButton";
import styles from "./CVForm01.module.css";

//  번호  종류(수상) 값   제목    삭제버튼    변경
const CVForm01 = ({
  index,
  type,
  data,
  labels,
  onRemove,
  onChange,
  mode,
  isSubmitted,
}) => {
  const handleChange = (field, value) => {
    onChange(type, index, field, value);
  };

  const [error, setError] = useState("");

  useEffect(() => {
    if (!data.title?.trim()) {
      setError(`${labels.title}을 입력해주세요.`);
    } else if (data.title.length > 20) {
      setError(`${labels.title}은 최대 20자까지 입력 가능합니다.`);
    } else if (!data.issuer?.trim()) {
      setError(`${labels.name}을 입력해주세요.`);
    } else if (data.issuer.length > 20) {
      setError(`${labels.name}은 최대 20자까지 입력 가능합니다.`);
    } else if (!data.date) {
      setError("날짜를 입력해주세요.");
    } else {
      setError("");
    }
  }, [data]);

  return (
    <>
      <div className={styles.section}>
        {mode !== "view" && mode !== "submit" && (
          <FormRemoveButton onClick={onRemove} />
        )}
        <div className={styles.inner}>
          <div className={styles.row}>
            <input
              className={styles.input}
              type="text"
              placeholder={labels.title}
              value={data.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder={labels.name}
              value={data.issuer || ""}
              onChange={(e) => handleChange("issuer", e.target.value)}
            />
            <YearMonthPicker
              mode={mode}
              value={data.date || "0000-00"}
              onChange={(val) => handleChange("date", val)}
            />
          </div>
        </div>
      </div>
      {isSubmitted && error && <div className="regex">{error}</div>}
    </>
  );
};

export default CVForm01;
