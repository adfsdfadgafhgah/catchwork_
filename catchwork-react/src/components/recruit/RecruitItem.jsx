import { Link } from "react-router-dom";
import styles from "./RecruitItem.module.css";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";

export default function RecruitItem({ recruit, onLikeToggle }) {
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

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loginMember?.memNo) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    try {
      const resp = await axiosApi.post("/corprecruit/like", {
        recruitNo: recruit.recruitNo,
        memNo: loginMember.memNo,
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

  return (
    <Link to={`/corprecruit/${recruit.recruitNo}`} className={styles.card}>
      <div className={styles.logoArea}>
        <img
          src={
            recruit.corpLogo
              ? `http://localhost:8080/${recruit.corpLogo}`
              : "/default-logo.png"
          }
          alt="기업 로고"
          className={styles.corpLogo}
        />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.titleRow}>
          <h3 className={styles.recruitTitle}>{recruit.recruitTitle}</h3>
          {recruit.recruitStatus === "마감" && (
            <span className={styles.closedBadge}>마감됨</span>
          )}
        </div>
        <p className={styles.corpName}>{recruit.corpName}</p>
        <p className={styles.locationCategory}>
          {recruit.recruitJobArea} ┃ {recruit.recruitCategory || "career"}{" "}
          {recruit.recruitField || "education"}
        </p>
        <p className={styles.deadline}>~{recruit.recruitEndDate}</p>

        <div className={styles.footer}>
          <span>
            <i className="fa-regular fa-eye" /> {recruit.recruitReadCount}
          </span>

          <span onClick={toggleLike} style={{ cursor: "pointer" }}>
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
