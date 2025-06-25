import { useState } from "react";
import CommentWrite from "./CommentWrite";
import CommentEdit from "./CommentEdit";
import CommentCss from "./CommentItem.module.css";
import { formatTimeAgo } from "./../common/formatTimeAgo";
import ReportModalPage from "../../pages/support/ReportModalPage";
import { useParams } from "react-router-dom";

export default function CommentItem({
  comment,
  childComments,
  loginUser,
  onRefresh,
}) {
  const [isReplyOpen, setIsReplyOpen] = useState(false); // 대댓글 입력창 열림 여부
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [showReportModal, setShowReportModal] = useState(false);
  const { commentNo } = useParams();

  const isWriter = loginUser && loginUser.memNo === comment.memNo;

  // 댓글 삭제
  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axiosApi.delete(`/comment/delete/${comment.commentNo}`);
      onRefresh();
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  // 신고하기 버튼 클릭 핸들러
  const handleReport = () => {
    if (!loginUser) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    if (isWriter) return; // 작성자는 신고 불가

    setShowReportModal(true);
  };

  // 신고하기 모달 취소하기 버튼
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  return (
    <div className={CommentCss.commentWrapper}>
      {/* 댓글 또는 수정 모드 */}
      {isEditing ? (
        <CommentEdit
          comment={comment}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            onRefresh();
          }}
        />
      ) : (
        <div className={CommentCss.commentBox}>
          <div className={CommentCss.header}>
            <div className={CommentCss.writerInfo}>
              {/* 대댓글이면 ㄴ자 선 보이게 */}
              {comment.parentCommentNo !== null && (
                <div className={CommentCss.replyLine}></div>
              )}
              <img
                src={
                  comment.memProfilePath
                    ? `http://localhost:8080/${comment.memProfilePath}`
                    : "/profile.png"
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

          <div className={CommentCss.content}>{comment.commentContent}</div>

          <div className={CommentCss.actions}>
            {/* 말풍선: 부모 댓글에만 노출 */}
            {comment.parentCommentNo === null && (
              <button
                className={CommentCss.actionBtn}
                onClick={() => setIsReplyOpen((prev) => !prev)}
              >
                <i className="fa-regular fa-comment-dots" />{" "}
                {childComments.length}
              </button>
            )}
            {isWriter ? (
              <>
                <button
                  className={CommentCss.actionBtn}
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </button>
                <button className={CommentCss.actionBtn} onClick={handleDelete}>
                  삭제
                </button>
              </>
            ) : (
              <button className={CommentCss.actionBtn} onClick={handleReport}>
                <span
                  className={`material-symbols-outlined ${CommentCss.iconSmall}`}
                >
                  siren
                </span>
                신고
              </button>
            )}
          </div>
        </div>
      )}

      {/* 대댓글 작성창 */}
      {isReplyOpen && (
        <div className={CommentCss.replyInputBox}>
          <CommentWrite
            boardNo={comment.boardNo}
            loginUser={loginUser}
            parentCommentNo={comment.commentNo}
            onAdd={onRefresh}
          />
        </div>
      )}

      {/* 대댓글 리스트 */}
      <div className={CommentCss.childList}>
        {childComments.map((child) => (
          <CommentItem
            key={child.commentNo}
            comment={child}
            childComments={[]} // 대댓글의 자식은 없음
            loginUser={loginUser}
            onRefresh={onRefresh}
          />
        ))}
      </div>
      {/* 신고하기 모달 */}
      {showReportModal && (
        <ReportModalPage
          targetNo={commentNo}
          targetType="comment"
          onClose={handleCloseReport}
        />
      )}
    </div>
  );
}
