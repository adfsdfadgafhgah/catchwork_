import React from "react"; // 기본 React
import styles from "./FormRemoveButton.module.css"; // x 버튼 전용 CSS 모듈
import CloseIcon from '@mui/icons-material/Close';

const FormRemoveButton = ({ onClick }) => (
  <button type="button" className={styles.removeBtn} onClick={onClick}>
    <CloseIcon className={styles.icon}/>
  </button>
);

export default FormRemoveButton;