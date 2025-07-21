import { Link, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import iconImg from "../../assets/icon.png";
import styles from "./BoardItem.module.css";
import { formatTimeAgo } from "./../common/formatTimeAgo";
import { useState } from "react";
import defaultImg from "../../assets/icon.png";

// props로 board와 memNo 받기
export default function BoardItem({ board, memNo }) {
  const profileImgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const boardImgUrl = import.meta.env.VITE_FILE_BOARD_IMG_URL;
  const navigate = useNavigate();

  // likeCount와 liked 상태를 props에서 직접 초기화
  const [likeCount, setLikeCount] = useState(board.likeCount);
  const [liked, setLiked] = useState(
    board.likedByCurrentUser === true || board.likedByCurrentUser === 1
  );

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // memNo prop을 사용하여 로그인 여부를 확인
    if (!memNo) {
      alert("로그인 후 이용해 주세요.");
      navigate(`/signin`);
      return;
    }

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: memNo, // memNo prop 사용
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
      <div className={styles.boardItem}>
        <div className={styles.boardItemLeft}>
          <img
            src={
              board.memProfilePath
                ? `${profileImgUrl}/${board.memProfilePath}`
                : defaultImg
            }
            alt="프로필 이미지"
            className={styles.profileImg}
          />
          <div className={styles.boardItemContent}>
            <div className={styles.authorDate}>
              <span className={styles.author}>{board.memNickname}</span>
              <span className={styles.date}>
                {formatTimeAgo(board.boardWriteDate)}
              </span>
            </div>
            {/* --- 변경된 부분 --- */}
            {/* 제목에서 글자 수 제한 로직 제거 (CSS에서 ellipsis로 처리) */}
            <h3 className={styles.title}>{board.boardTitle}</h3>
            <p className={styles.content}>
              {/* 이미지 태그 제거 로직은 유지 */}
              {board?.boardContent?.replace(/!\[.*?\]\(.*?\)/g, "") || ""}
            </p>

            {/* --- 변경된 부분 --- */}
            {/* 메타 정보 영역의 구조를 개선하여 가독성과 유지보수성 향상 */}
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <i className="fa-regular fa-eye"></i>
                <span>{board.boardReadCount}</span>
              </span>
              <span className={styles.metaItem}>
                <i className="fa-regular fa-comment"></i>
                <span>{board.commentCount}</span>
              </span>
              <span className={styles.metaItem} onClick={toggleLike}>
                <i
                  className={`fa-heart ${styles.likeIcon} ${
                    liked ? "fa-solid" : "fa-regular"
                  }`}
                  style={{
                    color: liked ? "var(--main-color)" : "var(--gray01)",
                  }}
                />
                <span>{likeCount}</span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.logo}>
          {board.boardThumbnailUrl ? (
            <img
              src={`${boardImgUrl}/${board.boardThumbnailUrl}`}
              alt="썸네일"
            />
          ) : (
            <img src={iconImg} alt="catchWork로고" />
          )}
        </div>
      </div>
    </Link>
  );
}
