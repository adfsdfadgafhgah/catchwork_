import MyCommentItem from "./MyCommentItem";
import CommentCss from "../board/CommentList.module.css";

export default function MyCommentList({ comments, loginMember, onRefresh }) {
  // 부모 댓글 추출 + 최신순 정렬
  const parentComments = comments
    .filter((c) => c.parentCommentNo === 0 || c.parentCommentNo === null)
    .sort(
      (a, b) => new Date(b.commentWriteDate) - new Date(a.commentWriteDate)
    );

  return (
    <div className={CommentCss.commentList}>
      {parentComments.map((parent) => {
        const childComments = comments
          .filter((c) => c.parentCommentNo === parent.commentNo)
          .sort(
            (a, b) =>
              new Date(a.commentWriteDate) - new Date(b.commentWriteDate)
          );

        return (
          <MyCommentItem
            key={parent.commentNo}
            comment={parent}
            childComments={childComments}
            loginMember={loginMember}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
}
