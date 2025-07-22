import { useState } from "react";
import CommentWrite from "./CommentWrite";
import CommentEdit from "./CommentEdit";
import styles from "./CommentItem.module.css";
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
    <div className={styles.commentWrapper}>
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
        <div className={styles.commentBox}>
          {/* CASE 0: 탈퇴(1) 또는 정지(2)된 회원의 댓글인 경우, 최우선으로 표시 */}
          {/* 수정된 코드: memStatus가 1 또는 2인 경우를 명시적으로 확인합니다. */}
          {comment.memStatus === 1 || comment.memStatus === 2 ? (
            <>
              <div className={styles.header}>
                <div className={styles.writerInfo}>
                  {comment.parentCommentNo > 0 && (
                    <div className={styles.replyLine}></div>
                  )}
                  <img
                    src={defaultImg}
                    alt="프로필"
                    className={styles.profileImg}
                  />
                  <span className={styles.nickname}>(알수없음)</span>
                </div>
                <span className={styles.date}>
                  {formatTimeAgo(comment.commentWriteDate)}
                </span>
              </div>
              {/* 탈퇴와 정지를 모두 포함하는 문구로 변경 */}
              <div className={styles.stopped}>
                [탈퇴 또는 정지된 회원의 댓글입니다]
              </div>
            </>
          ) : (
            <>
              {/* 기존 댓글 헤더 (정상 회원일 때만 보임) */}
              <div className={styles.header}>
                <div className={styles.writerInfo}>
                  {comment.parentCommentNo > 0 && (
                    <div className={styles.replyLine}></div>
                  )}
                  <img
                    src={
                      comment?.memProfilePath
                        ? `${imgUrl}/${comment?.memProfilePath}`
                        : defaultImg
                    }
                    alt="기업로고"
                    className={styles.profileImg}
                  />
                  <span className={styles.nickname}>{comment.memNickname}</span>
                </div>
                <span className={styles.date}>
                  {formatTimeAgo(comment.commentWriteDate)}
                </span>
              </div>

              {/* 댓글 내용 or 상태(삭제/정지)에 따른 메시지 표시 */}
              {(() => {
                switch (comment.commentStatus) {
                  case 1:
                    return (
                      <div className={styles.deleted}>삭제된 댓글입니다.</div>
                    );
                  case 2:
                    return (
                      <div className={styles.stopped}>
                        [관리자에 의해 정지된 댓글입니다]
                      </div>
                    );
                  default:
                    return (
                      <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{
                          __html: comment.commentContent.replace(
                            /\n/g,
                            "<br/>"
                          ),
                        }}
                      ></div>
                    );
                }
              })()}

              {/* 수정, 삭제, 신고 등 액션 버튼 */}
              <div className={styles.actions}>
                {comment.commentStatus === 0 &&
                  (comment.parentCommentNo === null ||
                    comment.parentCommentNo === 0) && (
                    <button
                      className={styles.actionBtn}
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
                        className={styles.actionBtn}
                        onClick={() => setIsEditing(true)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={handleDelete}
                      >
                        삭제
                      </button>
                    </>
                  ) : (
                    <button className={styles.actionBtn} onClick={handleReport}>
                      <span
                        className={`material-symbols-outlined ${styles.iconSmall}`}
                      >
                        siren
                      </span>
                      신고
                    </button>
                  ))}
              </div>
            </>
          )}
          {/* ----- ⬆️ 여기까지 수정된 부분 ⬆️ ----- */}
        </div>
      )}

      {/* 대댓글 작성창 */}
      {isReplyOpen && (
        <div className={styles.replyInputBox}>
          <CommentWrite
            boardNo={comment.boardNo}
            memNo={memNo}
            parentCommentNo={comment.commentNo}
            onAdd={(success) => {
              if (success) setIsReplyOpen(false); // 작성 후 닫기
              onRefresh(); // 목록 새로고침
            }}
          />
        </div>
      )}

      {/* 대댓글 리스트 */}
      <div className={styles.childList}>
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
