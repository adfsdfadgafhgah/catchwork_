import { useState } from "react";
import CommentCss from "./CommentWrite.module.css";
import { useLocation, useNavigate } from "react-router-dom";
// import axiosApi from "../../api/axiosAPI";

export default function CommentWrite({
  boardNo,
  loginUser,
  parentCommentNo = null, // 없으면 일반 댓글
  onAdd,
}) {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    if (!loginUser) {
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
        parentCommentNo,
      });

      setContent("");
      onAdd(); // 부모에게 목록 새로고침 요청
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  return (
    <div className={CommentCss.writeWrapper}>
      <textarea
        className={CommentCss.textarea}
        placeholder="댓글을 작성하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <div className={CommentCss.buttonGroup}>
        <button className={CommentCss.cancelBtn} onClick={() => setContent("")}>
          <i className="fa-solid fa-xmark"></i> 취소하기
        </button>
        <button className={CommentCss.submitBtn} onClick={handleSubmit}>
          <i className="fa-regular fa-pen-to-square"></i> 작성하기
        </button>
      </div>
    </div>
  );
}
