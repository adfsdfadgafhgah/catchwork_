import { Link } from "react-router-dom";
import { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import iconImg from "../../assets/icon.png";
import BoardCss from "./BoardItem.module.css";
import { formatTimeAgo } from "./../common/formatTimeAgo";

export default function BoardItem({ board, isLoggedIn, currentUser }) {
  const [likeCount, setLikeCount] = useState(board.likeCount);
  const [liked, setLiked] = useState(board.likedByCurrentUser); // 서버에서 true/false 전달

  const toggleLike = async (e) => {
    e.preventDefault(); // Link 이동 막기

    if (!isLoggedIn) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    try {
      const response = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: currentUser.memNo,
      });

      if (response.data.result === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (response.data.result === "unliked") {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  return (
    <Link to={`/board/${board.boardNo}`} className={BoardCss.linkWrapper}>
      <div className={BoardCss.boardItem}>
        <div className={BoardCss.boardItemLeft}>
          <img
            src={
              board.memProfilePath
                ? `http://localhost:8080/${board.memProfilePath}`
                : "/default-profile.png"
            }
            alt="프로필 이미지"
            className={BoardCss.profileImg}
          />

          <div className={BoardCss.boardItemContent}>
            <div className={BoardCss.authorDate}>
              <span className={BoardCss.author}>
                {board.member.memNickname}
              </span>
              <span className={BoardCss.date}>
                {formatTimeAgo(board.boardWriteDate)}
              </span>
            </div>
            <h3 className={BoardCss.title}>
              {/* 제목이 길 경우 */}
              {board.boardTitle.length > 40
                ? board.boardTitle.slice(0, 40) + "..."
                : board.boardTitle}
            </h3>
            <p className={BoardCss.content}>{board.boardContent}</p>
            <div className={BoardCss.meta}>
              <i className="fa-regular fa-eye"></i>
              {board.boardReadCount} &nbsp;&nbsp;{" "}
              <i className="fa-regular fa-comment"></i>
              {board.commentCount} &nbsp;&nbsp;{" "}
              <i
                className={`fa-heart ${liked ? "fas red" : "far"}`}
                onClick={toggleLike}
              ></i>{" "}
              {likeCount}
            </div>
          </div>
        </div>
        <div className={BoardCss.logo}>
          <img src={iconImg} alt="catchWork로고" />
        </div>
      </div>
    </Link>
  );
}

// // board.memProfilePath가 undefined일 경우 대비!
// <img
//   src={board.memProfilePath || "/default-profile.png"}
//   alt="프로필 이미지"
//   className={BoardCss.profileImg}
// />
