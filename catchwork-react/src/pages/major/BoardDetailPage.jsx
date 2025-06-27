// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { axiosApi } from "../../api/axiosAPI";
// import BoardCss from "./BoardDetailPage.module.css";
// import SectionHeader from "../../components/common/SectionHeader";
// // import { useContext } from "react";
// // import { AuthContext } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom"; // 페이지 이동용
// import CommentList from "../../components/board/CommentList";
// import { formatTimeAgo } from "../../components/common/formatTimeAgo";
// import ReportModalPage from "../support/ReportModalPage";
// import { Viewer } from "@toast-ui/react-editor"; // Toast UI Viewer 추가

// // 서버 구현 전 깡데이터용 ㅋㅋ
// export const dummyBoards = [
//   {
//     boardNo: 1,
//     boardTitle:
//       "제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? ",
//     boardContent:
//       "긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 ",
//     boardWriteDate: "2025-06-17",
//     boardReadCount: 1,
//     commentCount: 2,
//     likeCount: 3,
//     member: {
//       memNickname: "원기찬",
//       memNo: 100,
//     },
//   },

//   {
//     boardNo: 2,
//     boardTitle: "2번째 글취업도전 100번 째... 실패만 한다면?",
//     boardContent: "그냥 포기하고 행복한 백수로 살아보세요",
//     boardWriteDate: "2025-06-19",
//     boardReadCount: 3,
//     commentCount: 300,
//     likeCount: 14,
//     member: {
//       memNickname: "조민장",
//       memNo: 101,
//     },
//   },

//   {
//     boardNo: 3,
//     boardTitle: "세번째 글",
//     boardContent: "ㅇㅇ",
//     boardWriteDate: "2025-06-20",
//     boardReadCount: 22,
//     commentCount: 11,
//     likeCount: 1100,
//     member: {
//       memNickname: "허재호",
//       memNo: 102,
//     },
//   },
//   // ... 추가 가능
// ];

// export default function BoardDetailPage() {
//   const { boardNo } = useParams(); // URL에서 boardNo 추출
//   const [board, setBoard] = useState(null);
//   const navigate = useNavigate(); // ✅ 선언
//   const loginUser = { memNo: 100 };
//   const [showReportModal, setShowReportModal] = useState(false);

//   useEffect(() => {
//     // 🔍 깡 데이터에서 찾아서 set
//     const found = dummyBoards.find((b) => b.boardNo === parseInt(boardNo));
//     if (found) {
//       setBoard(found);
//     } else {
//       console.error("해당 게시글이 존재하지 않음");
//     }
//   }, [boardNo]);

//   const handleEdit = () => {
//     navigate(`/board/edit/${boardNo}`); // ✅ 수정 페이지 이동
//   };

//   // 게시글 삭제 함수
//   const handleDelete = () => {
//     if (!window.confirm("정말 삭제하시겠습니까?")) return;

//     // 삭제 로직 예시
//     alert("게시글이 삭제되었습니다.");
//     navigate("/board"); // 목록으로 이동
//   };

//   // 신고하기 버튼 클릭 핸들러
//   const handleReportClick = () => {
//     if (!loginUser) {
//       alert("로그인 후 이용해주세요.");
//       return;
//     }

//     setShowReportModal(true);
//   };

//   // 신고하기 모달 취소하기 버튼
//   const handleCloseReport = () => {
//     setShowReportModal(false);
//   };

//   if (!board) return <h2>Loading...</h2>;

//   return (
//     <div className={BoardCss.detailWrapper}>
//       {/* 섹션 헤더 */}
//       <SectionHeader title="취준진담" />
//       {/* 제목 + 수정/삭제 */}
//       <div className={BoardCss.headerRow}>
//         <h1 className={BoardCss.title}>{board.boardTitle}</h1>
//         {loginUser.memNo === board.member.memNo && (
//           <div className={BoardCss.actionButtons}>
//             <button className={BoardCss.actionBtn} onClick={handleEdit}>
//               <i className="fa-regular fa-pen-to-square"></i> 수정하기
//             </button>
//             <button className={BoardCss.actionBtn} onClick={handleDelete}>
//               <i className="fa-regular fa-trash-can"></i> 삭제하기
//             </button>
//           </div>
//         )}
//       </div>

//       {/* 작성자 정보 + 메타 정보 */}
//       <div className={BoardCss.metaRow}>
//         <div className={BoardCss.writerInfo}>
//           <img
//             src={
//               board.memProfilePath
//                 ? `http://localhost:8080/${board.memProfilePath}`
//                 : "/default-profile.png"
//             }
//             alt="프로필 이미지"
//           />
//           <span>{board.member.memNickname}</span>
//           <span>{formatTimeAgo(board.boardWriteDate)}</span>
//         </div>
//         <div className={BoardCss.metaInfo}>
//           <i className="fa-regular fa-eye"></i>
//           {board.boardReadCount}
//           <i className="fa-regular fa-heart"></i>
//           {board.likeCount}
//           {(!loginUser || loginUser.memNo !== board.member.memNo) && (
//             <button className={BoardCss.actionBtn} onClick={handleReportClick}>
//               <span
//                 className={`material-symbols-outlined ${BoardCss.iconSmall}`}
//               >
//                 siren
//               </span>
//               신고하기
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 본문 */}
//       <div className={BoardCss.contentBox}>{board.boardContent}</div>
//       {/* 댓글 컴포넌트 */}
//       <CommentList boardNo={board.boardNo} loginUser={{ memNo: 100 }} />
//       {/* 신고하기 모달 */}
//       {showReportModal && (
//         <ReportModalPage
//           targetNo={boardNo}
//           targetType="board"
//           // memNo={loginMemberSeq}
//           onClose={handleCloseReport}
//         />
//       )}
//     </div>
//   );
// }

//----------------------------------------------------------------------
// 추후 서버 구현 후 쓸 코드

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardCss from "./BoardDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
// import { useContext } from "react";
// import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import CommentList from "../../components/board/CommentList";
import { formatTimeAgo } from "../../components/common/formatTimeAgo";
import ReportModalPage from "../support/ReportModalPage";
import { Viewer } from "@toast-ui/react-editor"; // Toast UI Viewer 추가
import { useAuthStore } from "../../stores/authStore";

export default function BoardDetailPage() {
  const { boardNo } = useParams();
  const [board, setBoard] = useState(null);
  const { loginUser, memNo } = useAuthStore(); // 로그인 받아오기
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const navigate = useNavigate(); // ← 페이지 이동을 위해 추가
  const [showReportModal, setShowReportModal] = useState(false);

  // const customerKey = "95132b50-d360-400b-bfb2-5a1c51857f4c";

  // const loginUser = {
  //   memId: "h",
  //   memNickname: "배령",
  //   memEmail: "hbr0901@naver.com",
  //   memNo: customerKey,
  //   memType: "0",
  // };

  // loginUser 가져오기
  useEffect(() => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      console.log("zustand auth-store persist 값 =", parsed);
    } else {
      console.log("auth-storage 값 없음 (로그인 안했거나 persist 저장 전)");
    }
  }, []);

  // 게시글 상세 조회 API
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const resp = await axiosApi.get(`/board/detail/${boardNo}`, {
          params: { memNo: loginUser?.memNo },
        });
        const data = resp.data;
        setBoard(data);
        setLiked(data.likedByCurrentUser); // 서버에서 내려줘야 함
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("상세 조회 실패:", err);
      }
    };

    fetchDetail();
  }, [boardNo, loginUser]);

  // 수정 페이지로!
  const handleEdit = () => {
    navigate(`/board/edit/${boardNo}`);
  };

  // 게시글 삭제 함수
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const resp = await axiosApi.delete(`/board/delete/${boardNo}`, {
        data: { memNo: loginUser.memNo },
      });

      if (resp.data.success) {
        alert("삭제되었습니다.");
        navigate("/board"); // 삭제 후 목록으로 이동
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  // 좋아요 토글 함수 추가
  const toggleLike = async () => {
    if (!loginUser) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: loginUser.memNo,
      });

      if (resp.data.result === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  // 신고하기 버튼 클릭 핸들러
  const handleReportClick = () => {
    if (!loginUser) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    setShowReportModal(true);
  };

  // 신고하기 모달 취소하기 버튼
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  if (!board) return <h2>Loading...</h2>;

  console.log("🧪 board:", board);
  console.log("🧪 loginUser:", loginUser);
  console.log("🧪 board.member.memNo:", board?.member?.memNo);
  console.log("🧪 loginUser.memNo:", loginUser?.memNo);
  console.log("🧪 작성자 여부:", loginUser?.memNo === board?.member?.memNo);

  return (
    <>
      <div className={BoardCss.detailWrapper}>
        {/* 섹션 헤더 */}
        <SectionHeader title="취준진담" />

        {/* 제목 + 수정/삭제 */}
        <div className={BoardCss.headerRow}>
          <h1 className={BoardCss.title}>{board.boardTitle}</h1>
          {memNo && board?.member?.memNo && memNo === board.member.memNo && (
            <div className={BoardCss.actionButtons}>
              <button className={BoardCss.actionBtn} onClick={handleEdit}>
                <i className="fa-regular fa-pen-to-square"></i> 수정하기
              </button>
              <button className={BoardCss.actionBtn} onClick={handleDelete}>
                <i className="fa-regular fa-trash-can"></i> 삭제하기
              </button>
            </div>
          )}
        </div>

        {/* 작성자 정보 + 메타 정보 */}
        <div className={BoardCss.metaRow}>
          <div className={BoardCss.writerInfo}>
            <img
              src={
                board?.member?.memProfilePath
                  ? `http://localhost:8080/${board.member.memProfilePath}`
                  : "/default-profile.png"
              }
              alt="프로필"
            />
            <span>{board?.member?.memNickname}</span>
            <span>{formatTimeAgo(board.boardWriteDate)}</span>
          </div>
          <div className={BoardCss.metaInfo}>
            <i className="fa-regular fa-eye"></i> {board.boardReadCount}{" "}
            &nbsp;&nbsp;
            <i
              className={`fa-heart ${liked ? "fas red" : "far"}`}
              onClick={toggleLike}
            />{" "}
            {likeCount} &nbsp;&nbsp;
            {/* 신고하기 버튼 조건 렌더링 */}
            {memNo && board?.member?.memNo && memNo !== board.member.memNo && (
              <button
                className={BoardCss.actionBtn}
                onClick={handleReportClick}
              >
                <span
                  className={`material-symbols-outlined ${BoardCss.iconSmall}`}
                >
                  siren
                </span>
                신고하기
              </button>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className={BoardCss.contentBox}>
          {/* markdown을 HTML로 렌더링 */}
          <Viewer initialValue={board.boardContent} />
        </div>
      </div>
      {/* 댓글 컴포넌트 */}
      <CommentList boardNo={board.boardNo} loginUser={loginUser} />

      {/* 신고하기 모달 */}
      {showReportModal && (
        <ReportModalPage
          targetNo={boardNo}
          targetType="board"
          onClose={handleCloseReport}
        />
      )}
    </>
  );
}

// // 날짜 형식 바꾸기
// import dayjs from "dayjs";
// <span>{dayjs(board.boardWriteDate).format("YYYY-MM-DD")}</span>

// board가 null일 때 board.boardNo를 사용할 수 없을 때 쓸 조건부 렌더링
// {board && <CommentList boardNo={board.boardNo} loginUser={loginUser} />}
