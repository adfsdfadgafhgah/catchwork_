import { useState } from "react";
import styles from "./CommentWrite.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";

const MAX_COMMENT_LENGTH = 1000;

export default function CommentWrite({
  boardNo,
  parentCommentNo = null, // 없으면 일반 댓글
  onAdd, // 댓글 작성 후 목록 새로고침 콜백
  memNo, // memNo props로 받기
}) {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 댓글 내용 변경 핸들러 (글자 수 제한 기능)
  const handleContentChange = (e) => {
    const { value } = e.target;
    if (value.length <= MAX_COMMENT_LENGTH) {
      setContent(value);
    }
  };

  const handleSubmit = async () => {
    if (!memNo) {
      alert("로그인 후 이용해주세요.");
      // 현재 위치를 상태로 넘김
      navigate("/signin", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await axiosApi.post("/comment/write", {
        boardNo,
        commentContent: content,
        parentCommentNo: parentCommentNo || null,
        memNo: memNo,
      });

      setContent(""); // 입력창 초기화
      onAdd(true); // 부모에게 목록 새로고침 요청
      alert("댓글이 등록되었습니다.");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패하였습니다.");
    }
  };

  return (
    <div className={styles.writeWrapper}>
      <textarea
        className={styles.textarea}
        placeholder="댓글을 작성하세요"
        value={content}
        onChange={handleContentChange}
        rows={2}
        maxLength={MAX_COMMENT_LENGTH}
      />
      <div className={styles.bottomArea}>
        {/* 추가: 댓글 글자 수 카운터 */}
        <div className={styles.charCounter}>
          {content.length} / {MAX_COMMENT_LENGTH}
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelBtn} onClick={() => setContent("")}>
            <i className="fa-solid fa-xmark"></i> 취소하기
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <i className="fa-regular fa-pen-to-square"></i> 작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
