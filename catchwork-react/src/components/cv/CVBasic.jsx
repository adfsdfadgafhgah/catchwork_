import React from "react";
import { Camera } from "lucide-react";
import styles from "./CVBasic.module.css";

const CVBasic = ({ userInfo }) => {
  return (
    <div className={styles.photoAndBasicInfo}>
      <div className={styles.photoSection}>
        <div className={styles.photoPlaceholder}>
          <Camera size={40} color="#000000" />
        </div>
      </div>

      <div className={styles.basicInfo}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>이름</span>
            <span className={styles.infoText}>{userInfo.memName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>연락처</span>
            <span className={styles.infoText}>{userInfo.memTel}</span>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>성별</span>
            <span className={styles.infoText}>{userInfo.memGender}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>이메일</span>
            <span className={styles.infoText}>{userInfo.memEmail}</span>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={`${styles.infoItem} ${styles.birthItem}`}>
            <span className={styles.infoLabel}>생일</span>
            <span className={styles.infoText}>{userInfo.memBirthday}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBasic;
