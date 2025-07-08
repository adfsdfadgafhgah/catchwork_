import { Link } from "react-router-dom";
import styles from "./RecruitItem.module.css";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";
import defaultImg from "../../assets/icon.png";

export default function RecruitItem({ recruit, onLikeToggle }) {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const { loginMember, setLoginMember } = useLoginMember();
  const [likeCount, setLikeCount] = useState(recruit.likeCount || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!loginMember?.memNo) {
      const fetchLoginMember = async () => {
        await setLoginMember();
      };
      fetchLoginMember();
    }
  }, []);

  useEffect(() => {
    setLikeCount(recruit.likeCount || 0);
    if (loginMember?.memNo) {
      setLiked(
        recruit.likedByCurrentUser === true || recruit.likedByCurrentUser === 1
      );
    } else {
      setLiked(false);
    }
  }, [recruit.likeCount, recruit.likedByCurrentUser, loginMember?.memNo]);

  // 마감 여부 판단
  const isClosed =
    recruit.recruitStatus === 3 ||
    new Date() > new Date(`${recruit.recruitEndDate}T23:59:59`);

  return (
    <Link to={`/corpRecruit/${recruit.recruitNo}`} className={styles.card}>
      <div className={styles.logoArea}>
        <img
          src={recruit?.corpLogo ? `${imgUrl}/${recruit.corpLogo}` : defaultImg}
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
          {recruit.recruitJobArea} ┃ {recruit.recruitEdu} ┃ {""}
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
