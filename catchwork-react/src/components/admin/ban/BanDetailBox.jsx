import React from "react";
import styles from "./BanDetailBox.module.css";

const BanDetailBox = ({ banDetail, onRelease }) => {
  if (!banDetail) return <p className={styles.loadingMessage}>로딩 중...</p>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.infoSection}>
        <div className={styles.infoRow}><span className={styles.label}>정지 번호:</span><span className={styles.value}>{banDetail.banNo}</span></div>
        <div className={styles.infoRow}><span className={styles.label}>정지 대상 타입:</span><span className={styles.value}>{banDetail.banTargetType}</span></div>
        <div className={styles.infoRow}><span className={styles.label}>정지 대상 번호:</span><span className={styles.value}>{banDetail.banTargetNo}</span></div>
        <div className={styles.infoRow}><span className={styles.label}>정지 사유:</span><span className={styles.value}>{banDetail.banContent}</span></div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.submitButton} onClick={onRelease}>정지 해제</button>
      </div>
    </div>
  );
};

export default BanDetailBox;
