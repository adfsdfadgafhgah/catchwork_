import { useState } from "react";
import CommentWrite from "./CommentWrite";
import CommentEdit from "./CommentEdit";
import CommentCss from "./CommentItem.module.css";
import { formatTimeAgo } from "./../common/formatTimeAgo";
import ReportModalPage from "../../pages/support/ReportModalPage";
import { axiosApi } from "../../api/axiosAPI";
import defaultImg from "../../assets/icon.png";

export default function CommentItem({
  comment,
  childComments,
  memNo,
  onRefresh,
}) {
  const [isReplyOpen, setIsReplyOpen] = useState(false); // 대댓글 입력창 열림 여부
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [showReportModal, setShowReportModal] = useState(false);
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;

  const isWriter = memNo && memNo === comment.memNo;

  // 댓글 삭제
  const handleDelete = async () => {
    // 삭제는 로그인된 사용자만 가능하며, 자신의 댓글만 가능
    if (!memNo || memNo !== comment.memNo) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axiosApi.delete(`/comment/delete/${comment.commentNo}`);
      onRefresh();
      alert("댓글이 삭제되었습니다");
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  // 신고하기 버튼 클릭 핸들러
  const handleReport = () => {
    // memNo prop을 사용하여 로그인 여부를 확인합니다.
    if (!memNo) {
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
          memNo={memNo}
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
              {comment.parentCommentNo > 0 && (
                <div className={CommentCss.replyLine}></div>
              )}
              <img
                src={
                  comment?.memProfilePath
                    ? `${imgUrl}/${comment?.memProfilePath}`
                    : defaultImg
                }
                alt="기업로고"
                className={CommentCss.profileImg}
              />
              <span className={CommentCss.nickname}>{comment.memNickname}</span>
            </div>
            <span className={CommentCss.date}>
              {formatTimeAgo(comment.commentWriteDate)}
            </span>
          </div>

          {/*  댓글 내용 or 삭제된 댓글 표시 */}
          {comment.commentStatus === 1 ? (
            <div className={CommentCss.deleted}>삭제된 댓글입니다.</div>
          ) : (
            <div
              className={CommentCss.content}
              dangerouslySetInnerHTML={{
                __html: comment.commentContent.replace(/\n/g, "<br/>"),
              }}
            ></div>
          )}

          <div className={CommentCss.actions}>
            {/* 말풍선: 부모 댓글에만 노출 */}
            {comment.commentStatus === 0 &&
              (comment.parentCommentNo === null ||
                comment.parentCommentNo === 0) && (
                <button
                  className={CommentCss.actionBtn}
                  onClick={() => setIsReplyOpen((prev) => !prev)}
                >
                  <i className="fa-regular fa-comment-dots" />

                  {childComments.length}
                </button>
              )}
            {comment.commentStatus === 0 &&
              (isWriter ? (
                <>
                  <button
                    className={CommentCss.actionBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    수정
                  </button>
                  <button
                    className={CommentCss.actionBtn}
                    onClick={handleDelete}
                  >
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
              ))}
          </div>
        </div>
      )}

      {/* 대댓글 작성창 */}
      {isReplyOpen && (
        <div className={CommentCss.replyInputBox}>
          <CommentWrite
            boardNo={comment.boardNo}
            memNo={memNo}
            parentCommentNo={comment.commentNo}
            onAdd={(success) => {
              if (success) setIsReplyOpen(false); // 🔥 작성 후 닫기
              onRefresh(); // 목록 새로고침
            }}
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
            memNo={memNo}
            onRefresh={onRefresh}
          />
        ))}
      </div>
      {/* 신고하기 모달 */}
      {showReportModal && (
        <ReportModalPage
          targetNo={comment.commentNo.toString()}
          targetType="comment"
          targetNickname={comment.memNickname}
          memberNo={memNo}
          onClose={handleCloseReport}
        />
      )}
    </div>
  );
}
