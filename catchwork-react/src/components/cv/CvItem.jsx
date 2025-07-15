import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CvItem.module.css";

const CvItem = ({ cv, recruitNo, mode, onEdit, onDelete, onSubmit }) => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(`/cv/cvmanage?cvNo=${cv.cvNo}`);
  };

  return (
    <div className={styles.cvItem}>
      <div
        className={styles.cvTitle}
        onClick={handleTitleClick}
        style={{ cursor: "pointer" }}
      >
        {cv.cvAlias}
      </div>

      <div className={styles.cvActions}>
        {mode === "submit" ? (
          <button
            className={`${styles.cvButton} ${styles.submitButton}`}
            onClick={() => onSubmit(cv.cvNo, recruitNo)}
          >
            제출하기
          </button>
        ) : (
          <>
            <button
              className={`${styles.cvButton} ${styles.editButton}`}
              onClick={() => onEdit(cv.cvNo)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
              수정하기
            </button>
            <button
              className={`${styles.cvButton} ${styles.deleteButton}`}
              onClick={() => onDelete(cv.cvNo)}
            >
              <i className="fa-regular fa-trash-can"></i>삭제하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CvItem;
