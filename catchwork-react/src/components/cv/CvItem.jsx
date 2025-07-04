import React from "react";
import styles from "./CvItem.module.css";

const CvItem = ({ cv, recruitNo, mode, onEdit, onDelete, onSubmit }) => {
  return (
    <div className={styles.cvItem}>
      <div className={styles.cvTitle}>{cv.cvAlias}</div>

      <div className={styles.cvActions}>
      {mode === "submit" ? (
          <button
            className={`${styles.cvButton} ${styles.submitButton}`}
            onClick={() => onSubmit(cv.cvNo, recruitNo)}
          >
            제출하기
          </button>
        ):(    
          <>
            <button
              className={`${styles.cvButton} ${styles.editButton}`}
              onClick={() => onEdit(cv.cvNo)}
            >
              수정하기
            </button>
            <button
              className={`${styles.cvButton} ${styles.deleteButton}`}
              onClick={() => onDelete(cv.cvNo)}
            >
              삭제하기
            </button>
          </>    
        )
      }
      </div>
    </div>
  );
};

export default CvItem;
