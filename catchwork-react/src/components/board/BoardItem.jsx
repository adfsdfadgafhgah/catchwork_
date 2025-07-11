import { Link } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import iconImg from "../../assets/icon.png";
import BoardCss from "./BoardItem.module.css";
import { formatTimeAgo } from "./../common/formatTimeAgo";
import { useEffect, useState } from "react";
import defaultImg from "../../assets/icon.png";
// import useLoginMember from "../../stores/loginMember";

// 💡 props로 board와 memNo를 직접 받습니다.
export default function BoardItem({ board, memNo }) {
  const profileImgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const boardImgUrl = import.meta.env.VITE_FILE_BOARD_IMG_URL;

  // 💡 likeCount와 liked 상태를 props에서 직접 초기화합니다.
  const [likeCount, setLikeCount] = useState(board.likeCount);
  const [liked, setLiked] = useState(
    board.likedByCurrentUser === true || board.likedByCurrentUser === 1
  );

  // 💡 기존의 모든 useEffect 로직은 필요 없습니다.
  //    부모 컴포넌트(BoardListPage)가 이미 완벽한 데이터를 넘겨주고 있기 때문입니다.

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 💡 memNo prop을 사용하여 로그인 여부를 확인합니다.
    if (!memNo) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: memNo, // 💡 memNo prop 사용
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
    <Link to={`/board/${board.boardNo}`} className={BoardCss.linkWrapper}>
      <div className={BoardCss.boardItem}>
        <div className={BoardCss.boardItemLeft}>
          <img
            src={
              board.memProfilePath
                ? `${profileImgUrl}/${board.memProfilePath}`
                : defaultImg
            }
            alt="프로필 이미지"
            className={BoardCss.profileImg}
          />

          <div className={BoardCss.boardItemContent}>
            <div className={BoardCss.authorDate}>
              <span className={BoardCss.author}>{board.memNickname}</span>
              <span className={BoardCss.date}>
                {formatTimeAgo(board.boardWriteDate)}
              </span>
            </div>
            <h3 className={BoardCss.title}>
              {board.boardTitle.length > 40
                ? board.boardTitle.slice(0, 40) + "..."
                : board.boardTitle}
            </h3>
            <p className={BoardCss.content}>
              {board?.boardContent?.replace(/!\[.*?\]\(.*?\)/g, "") || ""}
            </p>
            <div className={BoardCss.meta}>
              <i className="fa-regular fa-eye"></i>
              {board.boardReadCount} &nbsp;&nbsp;{" "}
              <i className="fa-regular fa-comment"></i>
              {board.commentCount} &nbsp;&nbsp;{" "}
              <i
                className={`fa-heart ${
                  liked ? "fa-solid liked-heart" : "fa-regular"
                }`}
                onClick={toggleLike}
                style={{
                  cursor: "pointer",
                  color: liked ? "var(--main-color)" : "gray",
                }}
              />
              {likeCount}
            </div>
          </div>
        </div>
        <div className={BoardCss.logo}>
          {board.boardThumbnailUrl ? (
            <img
              src={`${boardImgUrl}/${board.boardThumbnailUrl}`}
              alt="썸네일"
              className={BoardCss.thumbnailImg}
            />
          ) : (
            <img src={iconImg} alt="catchWork로고" />
          )}
        </div>
      </div>
    </Link>
  );
}
