import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import CommentItem from "./CommentItem";
import CommentWrite from "./CommentWrite";
import CommentCss from "./CommentList.module.css";

export default function CommentList({ boardNo, memNo }) {
  const [comments, setComments] = useState([]);

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const resp = await axiosApi.get(`/comment/list`, {
        params: { boardNo },
      });
      // console.log(" 댓글 fetch 성공:", resp.data);
      setComments(resp.data); // 서버에서 정렬된 데이터가 오면 가장 좋음
    } catch (err) {
      console.error("댓글 fetch 실패:", err);
    }
  };

  useEffect(() => {
    if (boardNo) {
      fetchComments();
    }
  }, [boardNo]);

  useEffect(() => {
    comments.forEach((c, i) => {});
  }, [comments]);

  // 부모 댓글 추출 + 최신순 정렬
  const parentComments = comments
    .filter((c) => c.parentCommentNo === 0 || c.parentCommentNo === null)
    .sort(
      (a, b) => new Date(b.commentWriteDate) - new Date(a.commentWriteDate)
    );

  return (
    <div className={CommentCss.commentSection}>
      {/* 상단 작성창 */}
      <div className={CommentCss.writeWrapper}>
        <span className={CommentCss.commentCount}>
          댓글{" "}
          <span className={CommentCss.countNum}>
            {comments.filter((c) => c.commentStatus === 0).length}
          </span>
        </span>
        <CommentWrite boardNo={boardNo} memNo={memNo} onAdd={fetchComments} />
      </div>

      {/* 댓글 리스트 */}
      <div className={CommentCss.commentList}>
        {parentComments.map((parent) => {
          const childComments = comments
            .filter((c) => c.parentCommentNo === parent.commentNo)
            .sort(
              (a, b) =>
                new Date(a.commentWriteDate) - new Date(b.commentWriteDate)
            );

          return (
            <CommentItem
              key={parent.commentNo}
              comment={parent}
              childComments={childComments}
              memNo={memNo}
              onRefresh={fetchComments}
            />
          );
        })}
      </div>
    </div>
  );
}
