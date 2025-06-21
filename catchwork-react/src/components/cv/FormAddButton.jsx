import React from "react"; // 기본 React
import styles from "./FormAddButton.module.css"; // + 버튼 전용 CSS 모듈

const FormAddButton = ({ onClick }) => (
  <button type="button" className={styles.addBtn} onClick={onClick}>
    +
  </button>
);

export default FormAddButton;
