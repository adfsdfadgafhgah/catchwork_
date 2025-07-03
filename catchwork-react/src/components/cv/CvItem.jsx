import React from "react";
import styles from "./CvItem.module.css";

const CvItem = ({ cv, onEdit, onDelete }) => {
  return (
    <div className={styles.cvItem}>
      <div className={styles.cvTitle}>{cv.cvAlias}</div>

      <div className={styles.cvActions}>
        <button
          className={`${styles.cvButton} ${styles.editButton}`}
          onClick={() => onEdit(cv.cvNo)}
        >
          ✏️ 수정하기
        </button>
        <button
          className={`${styles.cvButton} ${styles.deleteButton}`}
          onClick={() => onDelete(cv.cvNo)}
        >
          🗑️ 삭제하기
        </button>
      </div>
    </div>
  );
};

export default CvItem;
