import { Link } from "react-router-dom";
import styles from "./RecruitItem.module.css";
import { useState, useEffect } from "react";
import defaultImg from "../../assets/icon.png";
import { extractPixelColor } from "../../api/extractPixelColor";

export default function RecruitItem({
  recruit,
  onLikeToggle,
  memNo,
  corpNo,
  memType,
}) {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const [likeCount, setLikeCount] = useState(recruit.likeCount || 0);
  const [liked, setLiked] = useState(
    recruit.likedByCurrentUser === true || recruit.likedByCurrentUser === 1
  );
  const [pixelColor, setPixelColor] = useState("transparent");

  // 기업 로고 색상 추출
  useEffect(() => {
    if (recruit?.corpLogo) {
      const imageUrl = `${logoImgUrl}/${recruit.corpLogo}`;
      extractPixelColor(imageUrl, 1, 1).then((color) => {
        setPixelColor(color.hex);
      });
    }
  }, [recruit?.corpLogo, logoImgUrl]);

  // 마감 여부 판단
  const isClosed =
    recruit.recruitStatus === 3 ||
    new Date() > new Date(`${recruit.recruitEndDate}T23:59:59`);

  return (
    <Link to={`/corpRecruit/${recruit.recruitNo}`} className={styles.card}>
      <div className={styles.logoArea}>
        <div
          className={styles.recruitItemImageBackground}
          style={{
            backgroundColor: pixelColor, // 추출된 색상 사용
          }}
        />
        <img
          src={
            recruit?.corpLogo ? `${logoImgUrl}/${recruit.corpLogo}` : defaultImg
          }
          alt="기업로고"
          className={styles.corpLogo}
        />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.titleRow}>
          <h3 className={styles.recruitTitle}>{recruit.recruitTitle}</h3>
        </div>
        <p className={styles.corpName}>{recruit.corpName}</p>
        <p className={styles.locationCategory}>
          {recruit.recruitJobArea} <br />
          {recruit.recruitEdu} ┃ {""}
          {recruit.recruitCareer}
        </p>
        <p className={styles.deadline}>~{recruit.recruitEndDate}</p>

        {/* 마감 여부 뱃지 표시 */}
        <div
          className={`${styles.recruitStatus} ${
            isClosed ? styles.closed : styles.open
          }`}
        >
          {isClosed ? "마감됨" : "채용중"}
        </div>

        <div className={styles.footer}>
          <span>
            <i className="fa-regular fa-eye" /> {recruit.recruitReadCount}
          </span>

          <span>
            <i
              className={`fa-heart ${liked ? "fa-solid" : "fa-regular"}`}
              style={{ color: liked ? "var(--main-color)" : "gray" }}
            />{" "}
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
