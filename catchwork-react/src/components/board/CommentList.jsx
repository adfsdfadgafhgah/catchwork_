import { useEffect, useState } from "react";
// import axiosApi from "../../api/axiosAPI";
import CommentItem from "./CommentItem";
import CommentWrite from "./CommentWrite";
import CommentCss from "./CommentList.module.css";

export default function CommentList({ boardNo, loginUser }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // 깡 더미 데이터 삽입
    const dummy = [
      {
        commentNo: 1,
        commentContent: "첫 번째 댓글입니다.",
        commentWriteDate: "2025-06-22",
        boardNo: 1,
        parentCommentNo: null,
        memNo: 100,
        memNickname: "작성자1",
      },
      {
        commentNo: 2,
        commentContent: "두 번째 댓글입니다.",
        commentWriteDate: "2025-06-24",
        boardNo: 1,
        parentCommentNo: null,
        memNo: 101,
        memNickname: "작성자2",
      },
      {
        commentNo: 3,
        commentContent: "대댓글입니다.",
        commentWriteDate: "2025-06-24",
        boardNo: 1,
        parentCommentNo: 1,
        memNo: 102,
        memNickname: "대댓글러",
      },
    ];
    setComments(dummy);
  }, [boardNo]);

  const parentComments = comments
    .filter((c) => c.parentCommentNo === null)
    .sort(
      (a, b) => new Date(b.commentWriteDate) - new Date(a.commentWriteDate)
    );

  return (
    <div className={CommentCss.commentSection}>
      <div className={CommentCss.writeWrapper}>
        <span className={CommentCss.commentCount}>
          댓글 <span className={CommentCss.countNum}>{comments.length}</span>
        </span>
        <CommentWrite
          boardNo={boardNo}
          loginUser={loginUser}
          onAdd={() => {}} // 깡이므로 더미 처리
        />
      </div>

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
              loginUser={loginUser}
              onRefresh={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
}

// 추후 서버구현 시 사용할 코드
// export default function CommentList({ boardNo, loginUser }) {
//   const [comments, setComments] = useState([]);

//   // 댓글 목록 가져오기
//   const fetchComments = async () => {
//     try {
//       const resp = await axiosApi.get(`/comment/list?boardNo=${boardNo}`);
//       setComments(resp.data); // 서버에서 정렬된 데이터가 오면 가장 좋음
//     } catch (err) {
//       console.error("댓글 불러오기 실패:", err);
//     }
//   };

//   useEffect(() => {
//     if (boardNo) fetchComments();
//   }, [boardNo]);

//   // 부모 댓글 추출 + 최신순 정렬
//   const parentComments = comments
//     .filter((c) => c.parentCommentNo === null)
//     .sort(
//       (a, b) => new Date(b.commentWriteDate) - new Date(a.commentWriteDate)
//     );

//   return (
//     <div className={CommentCss.commentSection}>
//       {/* 상단 작성창 */}
//       <div className={CommentCss.writeWrapper}>
//         <span className={CommentCss.commentCount}>
//          댓글 <span className={CommentCss.countNum}>{comments.length}</span>
//        </span>
//         <CommentWrite
//           boardNo={boardNo}
//           loginUser={loginUser}
//           onAdd={fetchComments}
//         />
//       </div>

//       {/* 댓글 리스트 */}
//       <div className={CommentCss.commentList}>
//         {parentComments.map((parent) => {
//           const childComments = comments
//             .filter((c) => c.parentCommentNo === parent.commentNo)
//             .sort(
//               (a, b) =>
//                 new Date(a.commentWriteDate) - new Date(b.commentWriteDate)
//             );

//           return (
//             <CommentItem
//               key={parent.commentNo}
//               comment={parent}
//               childComments={childComments}
//               loginUser={loginUser}
//               onRefresh={fetchComments}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }
