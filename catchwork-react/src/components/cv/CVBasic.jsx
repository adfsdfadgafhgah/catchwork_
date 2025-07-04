import React, { useEffect, useRef, useState } from "react";
import { Camera, Loader } from "lucide-react";
import styles from "./CVBasic.module.css";
import defaultImg from "../../assets/icon.png";

const CVBasic = ({ memberInfo, cvImgPath, onImageUpload, isUploading, mode }) => {
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState("");

  const imgUrl = import.meta.env.VITE_FILE_CV_IMG_URL;

  useEffect(() => {
    // previewSrc가 바뀔 때마다 기존 URL 정리
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewSrc(previewUrl);

      const success = await onImageUpload(file);
      if (!success) {
        setPreviewSrc("");
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.photoAndBasicInfo}>
      <div className={styles.photoSection}>
        <div
          className={styles.photoPlaceholder}
          onClick={!isUploading && mode !== "view" && mode !== "submit" ? handleClick : undefined}
          style={{ opacity: isUploading ? 0.5 : 1 }}
        >
          {isUploading ? (
            <Loader size={40} color="#000000" className={styles.spin} />
          ) : previewSrc || cvImgPath ? (
            <img
              src={
                previewSrc ||
                (cvImgPath ? `${imgUrl}/${cvImgPath}` : defaultImg)
              }
              alt="프로필"
              className={styles.previewImg}
            />
          ) : (
            <Camera size={40} color="#000000" />
          )}
        </div>

        {/* 업로드 중 표시 */}
        {isUploading && <div className={styles.loading}>업로드 중...</div>}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className={styles.basicInfo}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>이름</span>
            <span className={styles.infoText}>{memberInfo.memName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>연락처</span>
            <span className={styles.infoText}>{memberInfo.memTel}</span>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>성별</span>
            <span className={styles.infoText}>{memberInfo.memGender}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>이메일</span>
            <span className={styles.infoText}>{memberInfo.memEmail}</span>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={`${styles.infoItem} ${styles.birthItem}`}>
            <span className={styles.infoLabel}>생일</span>
            <span className={styles.infoText}>{memberInfo.memBirthday}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBasic;
