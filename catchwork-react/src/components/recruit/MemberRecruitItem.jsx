import { Link, useNavigate } from "react-router-dom";
import styles from "./RecruitItem.module.css";
import { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import defaultImg from "../../assets/icon.png";

export default function MemberRecruitItem({ recruit, onLikeToggle, memNo }) {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(recruit.likeCount || 0);
  const [liked, setLiked] = useState(
    recruit.likedByCurrentUser === true || recruit.likedByCurrentUser === 1
  );

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!memNo) {
      alert("로그인 후 이용해 주세요.");
      navigate("/signin");
      return;
    }

    try {
      const resp = await axiosApi.post("/memberRecruit/like", {
        recruitNo: recruit.recruitNo,
        memNo: memNo,
      });

      if (resp.data.result === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (resp.data.result === "unliked") {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }

      // 부모 컴포넌트에 변경사항 알림
      if (onLikeToggle) {
        onLikeToggle();
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 마감 여부 판단
  const isClosed =
    recruit.recruitStatus === 3 ||
    new Date() > new Date(`${recruit.recruitEndDate}T23:59:59`);

  return (
    <Link to={`/memberRecruit/${recruit.recruitNo}`} className={styles.card}>
      <div className={styles.logoArea}>
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
          {recruit.recruitJobArea} ┃ {recruit.recruitCareer} ┃
          {recruit.recruitEdu}
        </p>
        <p className={styles.deadline}>~{recruit.recruitEndDate}</p>

        {/* ✅ 마감 여부 뱃지 표시 */}
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

          <span onClick={toggleLike} style={{ cursor: "pointer" }}>
            <i
              className={`fa-heart ${styles.likeIcon} ${
                liked ? "fa-solid" : "fa-regular"
              }`}
              style={{ color: liked ? "var(--main-color)" : "gray" }}
            />{" "}
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
