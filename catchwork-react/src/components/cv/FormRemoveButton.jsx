import React from "react"; // 기본 React
import styles from "./FormRemoveButton.module.css"; // x 버튼 전용 CSS 모듈

const FormRemoveButton = ({ onClick }) => (
  <button type="button" className={styles.removeBtn} onClick={onClick}>
    x
  </button>
);

export default FormRemoveButton;
