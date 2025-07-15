import MyCommentItem from "./MyCommentItem";

export default function MyCommentList({ comments, memNo, onRefresh }) {
  return (
    <div className="commentList" style={{ marginTop: "20px" }}>
      {comments.map((comment) => {
        return (
          <MyCommentItem
            key={comment.commentNo}
            comment={comment}
            memNo={memNo}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
}
