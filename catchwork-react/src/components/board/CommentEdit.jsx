import { useState } from "react";
import CommentCss from "./CommentEdit.module.css";
import { formatTimeAgo } from "../common/formatTimeAgo";
import { axiosApi } from "../../api/axiosAPI";
import defaultImg from "../../assets/icon.png";

export default function CommentEdit({ comment, onCancel, onSuccess, memNo }) {
  const [content, setContent] = useState(comment.commentContent);
  const profileImg = import.meta.env.VITE_FILE_PROFILE_IMG_URL;

  const handleSubmit = async () => {
    if (!memNo || memNo !== comment.memNo) {
      alert("수정 권한이 없습니다.");
      onCancel(); // 권한이 없으면 수정 모드를 취소합니다.
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await axiosApi.put(`/comment/edit/${comment.commentNo}`, {
        commentContent: content,
        memNo: memNo,
      });
      onSuccess(); // 성공 시 부모에 알림
      alert("댓글이 수정되었습니다."); // 수정 완료 알림 추가
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패하였습니다.");
    }
  };

  return (
    <div className={CommentCss.writeWrapper}>
      {/* 프로필, 닉네임, 날짜는 그대로 유지 */}
      <div className={CommentCss.header}>
        <div className={CommentCss.writerInfo}>
          <img
            src={
              comment.memProfilePath
                ? `${profileImg}/${comment.memProfilePath}`
                : defaultImg
            }
            alt="프로필"
            className={CommentCss.profileImg}
          />
          <span className={CommentCss.nickname}>{comment.memNickname}</span>
        </div>
        <span className={CommentCss.date}>
          {formatTimeAgo(comment.commentWriteDate)}
        </span>
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
          <i className="fa-regular fa-pen-to-square"></i> 수정하기
        </button>
      </div>
    </div>
  );
}
