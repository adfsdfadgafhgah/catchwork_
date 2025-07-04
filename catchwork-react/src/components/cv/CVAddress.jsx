// src/components/cv/CVAddress.jsx
import React from "react";
import styles from "./CVAddress.module.css";

const CVAddress = ({ formData, onChange }) => {
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
            <input
              type="text"
              className={styles.infoInput}
              placeholder="도로명/지번 주소"
              value={formData.mainAddress}
              onChange={(e) => onChange("mainAddress", e.target.value)}
            />
          </div>
          {/* 상세주소 */}
          <input
            type="text"
            className={styles.infoInput}
            placeholder="상세주소"
            value={formData.detailAddress}
            onChange={(e) => onChange("detailAddress", e.target.value)}
          />
        </div>
      </div>

    </div>
  );
};

export default CVAddress;
