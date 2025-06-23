// src/components/cv/CVAddress.jsx
import React from "react";
import styles from "./CVAddress.module.css";

const CVAddress = ({ formData, onChange, onSearch }) => {
  return (
    <>
      {/* 도로명/지번 주소 */}
      <div className={styles.infoRow}>
        <div className={`${styles.infoItem} ${styles.addressItem}`}>
          <span className={styles.infoLabel}>주소</span>
          <div className={styles.addressInputs}>
            <input
              type="text"
              className={styles.infoInput}
              placeholder="도로명/지번 주소"
              value={formData.mainAddress}
              onChange={(e) => onChange("mainAddress", e.target.value)}
            />
            <button
              type="button"
              className={styles.addressSearchBtn}
              onClick={onSearch}
            >
              주소찾기
            </button>
          </div>
        </div>
      </div>

      {/* 상세주소 */}
      <div className={styles.infoRow}>
        <div className={`${styles.infoItem} ${styles.addressItem}`}>
          <input
            type="text"
            className={styles.infoInput}
            placeholder="상세주소"
            value={formData.detailAddress}
            onChange={(e) => onChange("detailAddress", e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default CVAddress;
