import { useState } from "react";
import CommentCss from "./CommentEdit.module.css";
// import axiosApi from "../../api/axiosAPI";

export default function CommentEdit({ comment, onCancel, onSuccess }) {
  const [content, setContent] = useState(comment.commentContent);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await axiosApi.put(`/comment/edit/${comment.commentNo}`, {
        commentContent: content,
      });
      onSuccess(); // 성공 시 부모에 알림
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  return (
    <div className={CommentCss.writeWrapper}>
      {/* 프로필, 닉네임, 날짜는 그대로 유지 */}
      <div className={CommentCss.header}>
        <div className={CommentCss.writerInfo}>
          <img
            src={comment.memProfilePath || "/profile.png"}
            alt="프로필"
            className={CommentCss.profileImg}
          />
          <span className={CommentCss.nickname}>{comment.memNickname}</span>
        </div>
        <span className={CommentCss.date}>{comment.commentWriteDate}</span>
      </div>

      {/* 수정 input */}
      <div className={CommentCss.contentWrapper}>
        <textarea
          className={CommentCss.textarea}
          placeholder="댓글을 작성하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />
      </div>

      {/* 버튼 */}
      <div className={CommentCss.buttonGroup}>
        <button className={CommentCss.cancelBtn} onClick={onCancel}>
          <i className="fa-solid fa-xmark"></i> 취소하기
        </button>
        <button className={CommentCss.submitBtn} onClick={handleSubmit}>
          <i className="fa-regular fa-pen-to-square"></i> 저장하기
        </button>
      </div>
    </div>
  );
}
