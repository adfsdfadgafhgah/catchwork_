import React from "react"; // 기본 React
import styles from "./FormAddButton.module.css"; // + 버튼 전용 CSS 모듈
import AddIcon from "@mui/icons-material/Add";

const FormAddButton = ({ onClick }) => (
  <button type="button" className={styles.addBtn} onClick={onClick}>
    <span className={`material-symbols-outlined ${styles.addIcon}`}>add</span>
  </button>
);

export default FormAddButton;
