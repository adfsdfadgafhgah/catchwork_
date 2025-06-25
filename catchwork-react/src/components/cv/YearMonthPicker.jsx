// src/components/common/YearMonthPicker.jsx
import React from "react";
// 날짜 선택 라이브러리
import DatePicker from "react-datepicker";
// 한국어 로케일 등록용 함수
import { registerLocale } from "react-datepicker";
// 한국어 로케일 객체
import ko from "date-fns/locale/ko";
// 날짜 선택 스타일
import "react-datepicker/dist/react-datepicker.css";
import styles from "./YearMonthPicker.module.css";

registerLocale("ko", ko);

const YearMonthPicker = ({ value, onChange, mode }) => {
  const parsedValue =
    value && /^\d{4}-\d{2}$/.test(value) && value !== "0000-00"
      ? new Date(value + "-01")
      : null;

  return (
    <DatePicker
      selected={parsedValue}
      disabled={mode === "view"}
      onChange={(date) => {
        if (date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          onChange(`${year}-${month}`);
        } else {
          onChange("0000-00");
        }
      }}
      dateFormat="yyyy-MM"
      showMonthYearPicker
      showFullMonthYearPicker
      locale="ko"
      placeholderText="0000-00"
      className={styles.input}
    />
  );
};

export default YearMonthPicker;
