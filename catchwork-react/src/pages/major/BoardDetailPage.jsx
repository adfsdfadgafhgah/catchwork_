import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardCss from "./BoardDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";

// 서버 구현 전 깡데이터용 ㅋㅋ
const dummyBoards = [
  {
    boardNo: 1,
    boardTitle: "취업도전 100번 째... 실패만 한다면?",
    boardContent: "그냥 포기하고 행복한 백수로 살아보세요",
    boardWriteDate: "2025-08-09",
    boardReadCount: 70,
    commentCount: 23,
    likeCount: 14,
    member: {
      memNickname: "으후루꾸꾸루후으으후",
    },
  },
  // ... 추가 가능
];

export default function BoardDetailPage() {
  const { id } = useParams(); // URL에서 boardNo 추출
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // 🔍 깡 데이터에서 찾아서 set
    const found = dummyBoards.find((b) => b.boardNo === parseInt(id));
    if (found) {
      setBoard(found);
    } else {
      console.error("해당 게시글이 존재하지 않음");
    }
  }, [id]);

  if (!board) return <h2>Loading...</h2>;

  return (
    <div className={BoardCss.detailWrapper}>
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담" />
      {/* 제목 + 수정/삭제 */}
      <div className={BoardCss.headerRow}>
        <h1 className={BoardCss.title}>첫 번째 글 테스트</h1>
        <div className={BoardCss.actionButtons}>
          <button className={BoardCss.actionBtn}>
            <i className="fa-regular fa-pen-to-square"></i> 수정하기
          </button>
          <button className={BoardCss.actionBtn}>
            <i className="fa-regular fa-trash-can"></i> 삭제하기
          </button>
        </div>
      </div>

      {/* 작성자 정보 + 메타 정보 */}
      <div className={BoardCss.metaRow}>
        <div className={BoardCss.writerInfo}>
          <img src="/profile.png" alt="프로필" />
          <span>으후루꾸꾸루후으으후</span>
          <span>2025-08-09</span>
        </div>
        <div className={BoardCss.metaInfo}>
          <i className="fa-regular fa-eye"></i>1 &nbsp;&nbsp;{" "}
          <i className="fa-regular fa-heart"></i>3 &nbsp;&nbsp;{" "}
          <button className={BoardCss.actionBtn}>
            <i className="fa-regular fa-paper-plane"></i> 신고하기
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className={BoardCss.contentBox}>디테일로 왔음</div>
    </div>
  );
}

// // 추후 서버 구현 후 쓸 코드
// export default function BoardDetailPage() {
//   const { boardNo } = useParams();
//   const [board, setBoard] = useState(null);

//   useEffect(() => {
//     // 게시글 상세 조회 API
//     const fetchDetail = async () => {
//       try {
//         const resp = await axiosApi.get(`/board/detail/${boardNo}`);
//         setBoard(resp.data);
//       } catch (err) {
//         console.error("상세 조회 실패:", err);
//       }
//     };

//     fetchDetail();
//   }, [boardNo]);

//   if (!board) return <h2>Loading...</h2>;

//   return (
//     <div className="board-detail-page">
//       <h1>{board.boardTitle}</h1>

//       <div className="writer-info">
//         <img src="/profile.svg" alt="프로필" />
//         <span>{board.member.memNickname}</span>
//         <span>{board.boardWriteDate}</span>
//       </div>

//       <div className="board-content">{board.boardContent}</div>

//       <div className="board-actions">
//         <button>✏ 수정하기</button>
//         <button>🗑 삭제하기</button>
//         <button>🚨 신고하기</button>
//       </div>

//       <div className="board-meta">
//         👁 {board.boardReadCount} &nbsp;&nbsp; 💬 {board.commentCount}
//       </div>
//     </div>
//   );
// }
