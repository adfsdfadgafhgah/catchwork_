import { Link } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import iconImg from "../../assets/icon.png";
import BoardCss from "./BoardItem.module.css";
import { formatTimeAgo } from "./../common/formatTimeAgo";
import useLoginMember from "../../stores/loginMember";
import { useEffect, useState } from "react";

export default function BoardItem({ board, onLikeToggle }) {
  const { loginMember, setLoginMember } = useLoginMember();
  const [likeCount, setLikeCount] = useState(board.likeCount);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!loginMember?.memNo) {
      const fetchLoginMember = async () => {
        await setLoginMember();
      };
      fetchLoginMember();
    }
  }, []);

  // props와 loginMember가 모두 준비되었을 때 상태 동기화
  useEffect(() => {
    console.log("💡 board.likedByCurrentUser =", board.likedByCurrentUser);
    console.log("💡 loginMember =", loginMember);

    setLikeCount(board.likeCount);

    // loginMember가 있을 때만 liked 상태 설정
    if (loginMember?.memNo) {
      setLiked(
        board.likedByCurrentUser === true || board.likedByCurrentUser === 1
      );
    } else {
      setLiked(false);
    }
  }, [board.likeCount, board.likedByCurrentUser, loginMember?.memNo]);

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loginMember?.memNo) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: loginMember.memNo,
      });

      console.log("좋아요 응답:", resp.data);

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
            <p className={BoardCss.content}>{board.boardContent}</p>
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
              src={`http://localhost:8080/${board.boardThumbnailUrl}`}
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

// // board.memProfilePath가 undefined일 경우 대비!
// <img
//   src={board.memProfilePath || "/default-profile.png"}
//   alt="프로필 이미지"
//   className={BoardCss.profileImg}
// />
