// src/components/cv/CVAddress.jsx
import React from "react";
import styles from "./CVAddress.module.css";

const CVAddress = ({ formData }) => {
  return (
    <div className={styles.infoSection}>
      {/* 제목 */}
      <div className={`${styles.infoRow} ${styles.infoTitle}`}>
        <div className={`${styles.infoItem} ${styles.addressItem}`}>
          <div className={styles.infoLabel}>주소</div>
        </div>
      </div>

      {/* 도로명/지번 주소 */}
      <div className={`${styles.infoRow} ${styles.infoContent}`}>
        <div className={`${styles.infoItem} ${styles.addressItem}`}>
          <div className={styles.addressInputs}>
            <span className={styles.infoInput}>{formData.mainAddress}</span>
          </div>
          {/* 상세주소 */}
          <span className={styles.infoInput}>{formData.detailAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default CVAddress;
