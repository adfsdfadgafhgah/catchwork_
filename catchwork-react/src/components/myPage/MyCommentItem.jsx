import { useState, useRef } from "react";
import CommentCss from "../board/CommentItem.module.css";
import { formatTimeAgo } from "../common/formatTimeAgo";
import { axiosApi } from "../../api/axiosAPI";
import defaultImg from "../../assets/icon.png";
import { NavLink } from "react-router-dom";

export default function MyCommentItem({
  comment,
  childComments,
  loginMember,
  onRefresh,
}) {
  const [isReplyOpen, setIsReplyOpen] = useState(false); // 대댓글 입력창 열림 여부
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [showReportModal, setShowReportModal] = useState(false);
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const isEditingOrReplyOpen = useRef(false); // 수정/삭제 버튼 클릭시 NavLink 클릭 방지

  const isWriter = loginMember && loginMember.memNo === comment.memNo;

  // 댓글 삭제
  const handleDelete = async () => {
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
    if (!loginMember) {
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

  // 수정/삭제 버튼 클릭시 NavLink 클릭 방지
  const handleClick = (e) => {
    if (isEditingOrReplyOpen.current) {
      e.preventDefault();
    }
    isEditingOrReplyOpen.current = false;
  };

  return (
    <NavLink
      to={`/board/${comment.boardNo}`}
      style={{ textDecoration: "none" }}
      onClick={handleClick}
    >
      <div className={CommentCss.commentWrapper}>
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
                  <button className={CommentCss.actionBtn}>수정</button>
                  <button
                    className={CommentCss.actionBtn}
                    onClick={(e) => {
                      handleDelete();
                      isEditingOrReplyOpen.current = true;
                    }}
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  className={CommentCss.actionBtn}
                  onClick={(e) => {
                    handleReport();
                    isEditingOrReplyOpen.current = true;
                  }}
                >
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
        {/* 신고하기 모달 */}
        {showReportModal && (
          <ReportModalPage
            targetNo={comment.commentNo.toString()}
            targetType="comment"
            targetNickname={comment.memNickname}
            memberNo={loginMember?.memNo}
            onClose={handleCloseReport}
          />
        )}
      </div>
    </NavLink>
  );
}
