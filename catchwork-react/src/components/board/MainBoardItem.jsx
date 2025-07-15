// components/board/MainBoardItem.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import iconImg from "../../assets/icon.png";
import defaultImg from "../../assets/icon.png";
import { formatTimeAgo } from "../common/formatTimeAgo";
import styles from "./MainBoardItem.module.css";

export default function MainBoardItem({ board, memNo }) {
  const profileImgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const boardImgUrl = import.meta.env.VITE_FILE_BOARD_IMG_URL;
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(board.likeCount);
  const [liked, setLiked] = useState(
    board.likedByCurrentUser === true || board.likedByCurrentUser === 1
  );

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!memNo) {
      alert("로그인 후 이용해 주세요.");
      navigate(`/signin`);
      return;
    }

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: memNo,
      });

      if (resp.data.result === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (resp.data.result === "unliked") {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Link to={`/board/${board.boardNo}`} className={styles.linkWrapper}>
      <div className={styles.card}>
        {/* ✅ 썸네일 가장 위로 이동 */}
        <div className={styles.thumbnail}>
          {board.boardThumbnailUrl ? (
            <img
              src={`${boardImgUrl}/${board.boardThumbnailUrl}`}
              alt="썸네일"
            />
          ) : (
            <img src={iconImg} alt="catchWork 로고" />
          )}
        </div>

        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <img
              src={
                board.memProfilePath
                  ? `${profileImgUrl}/${board.memProfilePath}`
                  : defaultImg
              }
              alt="작성자 프로필"
              className={styles.profileImg}
            />
            <span className={styles.author}>{board.memNickname}</span>
          </div>
          <span className={styles.date}>
            {formatTimeAgo(board.boardWriteDate)}
          </span>
        </div>

        <div className={styles.title}>
          {board.boardTitle.length > 40
            ? board.boardTitle.slice(0, 40) + "..."
            : board.boardTitle}
        </div>

        <div className={styles.content}>
          {board?.boardContent?.replace(/!\[.*?\]\(.*?\)/g, "") || ""}
        </div>

        <div className={styles.meta}>
          <span>
            <i className="fa-regular fa-eye" /> {board.boardReadCount}
          </span>
          <span>
            <i className="fa-regular fa-comment" /> {board.commentCount}
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
