import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardCss from "./BoardDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
// import { useContext } from "react";
// import { AuthContext } from "../../contexts/AuthContext";

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
  const { boardNo } = useParams(); // URL에서 boardNo 추출
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // 🔍 깡 데이터에서 찾아서 set
    const found = dummyBoards.find((b) => b.boardNo === parseInt(boardNo));
    if (found) {
      setBoard(found);
    } else {
      console.error("해당 게시글이 존재하지 않음");
    }
  }, [boardNo]);

  if (!board) return <h2>Loading...</h2>;

  return (
    <div className={BoardCss.detailWrapper}>
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담" />
      {/* 제목 + 수정/삭제 */}
      <div className={BoardCss.headerRow}>
        <h1 className={BoardCss.title}>
          "제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면??
          제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면??
          제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면??
          제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면??
          제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면??
          제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면??
          제목이 오지게 길다면??{" "}
        </h1>
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
      <div className={BoardCss.contentBox}>
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면?? 내용이 오지게 길다면?? 내용이 오지게 길다면??
        내용이 오지게 길다면??{" "}
      </div>
    </div>
  );
}

// // 추후 서버 구현 후 쓸 코드
// export default function BoardDetailPage() {
//   const { boardNo } = useParams();
//   const [board, setBoard] = useState(null);
//   const { loginUser } = useContext(AuthContext); // 로그인 받아오기
//   const [liked, setLiked] = useState(false); // 좋아요 기능
//   const [likeCount, setLikeCount] = useState(0); // 좋아요 기능

//   useEffect(() => {
//     // 게시글 상세 조회 API
//     const fetchDetail = async () => {
//       try {
//         const resp = await axiosApi.get(`/board/detail/${boardNo}`);
//         const data = resp.data;
//         setBoard(data);
//         setLiked(data.likedByCurrentUser); // 서버에서 내려줘야 함
//         setLikeCount(data.likeCount);
//       } catch (err) {
//         console.error("상세 조회 실패:", err);
//       }
//     };

//     fetchDetail();
//   }, [boardNo]);

// // 좋아요 토글 함수 추가
// const toggleLike = async () => {
//   if (!loginUser) {
//     alert("로그인 후 이용 가능합니다.");
//     return;
//   }

//   try {
//     const resp = await axiosApi.post("/board/like", {
//       boardNo: board.boardNo,
//       memNo: loginUser.memNo,
//     });

//     if (resp.data.result === "liked") {
//       setLiked(true);
//       setLikeCount((prev) => prev + 1);
//     } else {
//       setLiked(false);
//       setLikeCount((prev) => prev - 1);
//     }
//   } catch (err) {
//     console.error("좋아요 실패:", err);
//   }
// };

// // 신고하기 버튼 클릭 핸들러
// const handleReportClick = () => {
//   if (!loginUser) {
//     alert("로그인 후 이용해주세요.");
//     return;
//   }

//   // 여기에 신고 모달 열기나 서버 요청 추가
//   alert("신고 처리 로직 실행 (예: 신고 모달 열기)");
// };

// if (!board) return <h2>Loading...</h2>;

// return (
//   <div className={BoardCss.detailWrapper}>
//     {/* 섹션 헤더 */}
//     <SectionHeader title="취준진담" />

//     {/* 제목 + 수정/삭제 */}
//     <div className={BoardCss.headerRow}>
//       <h1 className={BoardCss.title}>{board.boardTitle}</h1>
//       {loginUser && loginUser.memNo === board.member.memNo && (
//       <div className={BoardCss.actionButtons}>
//         <button className={BoardCss.actionBtn}>
//           <i className="fa-regular fa-pen-to-square"></i> 수정하기
//         </button>
//         <button className={BoardCss.actionBtn}>
//           <i className="fa-regular fa-trash-can"></i> 삭제하기
//         </button>
//       </div>
//       )}
//     </div>

//     {/* 작성자 정보 + 메타 정보 */}
//     <div className={BoardCss.metaRow}>
//       <div className={BoardCss.writerInfo}>
//         <img src="/profile.png" alt="프로필" />
//         <span>{board.member.memNickname}</span>
//         <span>{board.boardWriteDate}</span>
//       </div>
//       <div className={BoardCss.metaInfo}>
//         <i className="fa-regular fa-eye"></i> {board.boardReadCount}{" "}
//         &nbsp;&nbsp;
//         <i
//           className={`fa-heart ${liked ? "fas red" : "far"}`}
//           onClick={toggleLike}
//         />{" "}
//         {likeCount} &nbsp;&nbsp;
{
  /* 신고하기 버튼 조건 렌더링 */
}
// {(!loginUser || loginUser.memNo !== board.member.memNo) && (
//   <button className={BoardCss.actionBtn} onClick={handleReportClick}>
//     <i className="fa-regular fa-paper-plane"></i> 신고하기
//   </button>
// )}
//       </div>
//     </div>

//     {/* 본문 */}
//     <div className={BoardCss.contentBox}>{board.boardContent}</div>
//   </div>
// );
// }

// // 날짜 형식 바꾸기
// import dayjs from "dayjs";
// <span>{dayjs(board.boardWriteDate).format("YYYY-MM-DD")}</span>
