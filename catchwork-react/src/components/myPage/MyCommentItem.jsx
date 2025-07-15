import { useRef } from "react";
import { formatTimeAgo } from "../common/formatTimeAgo";
import { axiosApi } from "../../api/axiosAPI";
import defaultImg from "../../assets/icon.png";
import { NavLink } from "react-router-dom";
import styles from "./MyCommentItem.module.css";

export default function MyCommentItem({ comment, memNo, onRefresh }) {
  const imgUrl = import.meta.env.VITE_FILE_BOARD_IMG_URL;
  const isEditingOrReplyOpen = useRef(false); // 수정/삭제 버튼 클릭시 NavLink 클릭 방지

  // 댓글 삭제
  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axiosApi.delete(`/comment/delete/${comment.commentNo}`);
      onRefresh();
      alert("댓글이 삭제되었습니다");
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  // 수정/삭제 버튼 클릭시 NavLink 클릭 방지
  const handleClick = (e) => {
    if (isEditingOrReplyOpen.current) {
      e.preventDefault();
    }
    isEditingOrReplyOpen.current = false;
  };

  return (
    <NavLink
      to={`/board/${comment?.boardNo}`}
      className={styles.navLink}
      onClick={handleClick}
    >
      <div className={styles.commentWrapper}>
        <div className={styles.commentBox}>
          {/* 댓글 내용 */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: comment?.commentContent?.replace(/\n/g, "<br/>"),
            }}
          ></div>

          <span className={styles.date}>
            {formatTimeAgo(comment?.commentWriteDate)}
          </span>

          <div className={styles.boardInfo}>
            <div className={styles.boardTitle}>{comment?.boardTitle}</div>
            <div className={styles.commentCount}>
              댓글 {comment?.commentCount}
            </div>
          </div>
        </div>
        <img
          src={
            comment?.boardThumbnailUrl
              ? `${imgUrl}/${comment?.boardThumbnailUrl}`
              : defaultImg
          }
          alt="게시글 썸네일"
          className={styles.boardThumbnail}
        />
      </div>
    </NavLink>
  );
}
