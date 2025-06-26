// // 더미데이터
// import { useEffect, useState } from "react";
// import { axiosApi } from "../../api/axiosAPI";
// import BoardList from "../../components/board/BoardList";
// import BoardCss from "./BoardListPage.module.css";
// import SectionHeader from "../../components/common/SectionHeader";
// import { useNavigate } from "react-router-dom";
// import FloatButton from "../../components/common/FloatButton";
// import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
// // import { useContext } from "react";
// // import { AuthContext } from "../../contexts/AuthContext"; // AuthContext 사용 시 loginUser 가져오기

// export default function BoardListPage() {
//   const [boards, setBoards] = useState([]); // 게시글 목록 조회
//   const [isloading, setIsLoading] = useState(true); // 로딩 상태
//   const [searchTerm, setSearchTerm] = useState("");
//   // const { loginUser } = useContext(AuthContext); // AuthContext 사용 시 loginUser 가져오기
//   // const loginUser = JSON.parse(localStorage.getItem("loginUser")); // localStorage 또는 sessionStorage에서 꺼내는 경우
//   const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태
//   const navigate = useNavigate();
//   const [filteredBoards, setFilteredBoards] = useState([]);
//   const [isSearchMode, setIsSearchMode] = useState(false);

//   // 더미 데이터
//   const dummyBoards = [
//     {
//       boardNo: 1,
//       boardTitle:
//         "제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? 제목이 오지게 길다면?? ",
//       boardContent:
//         "긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 긴글 ",
//       boardWriteDate: "2025-06-17",
//       boardReadCount: 1,
//       commentCount: 2,
//       likeCount: 3,
//       member: {
//         memNickname: "원기찬",
//       },
//     },
//     {
//       boardNo: 2,
//       boardTitle: "2번째 글취업도전 100번 째... 실패만 한다면?",
//       boardContent: "그냥 포기하고 행복한 백수로 살아보세요",
//       boardWriteDate: "2025-06-19",
//       boardReadCount: 3,
//       commentCount: 300,
//       likeCount: 14,
//       member: {
//         memNickname: "조민장",
//       },
//     },
//     {
//       boardNo: 3,
//       boardTitle: "세번째 글",
//       boardContent: "ㅇㅇ",
//       boardWriteDate: "2025-06-20",
//       boardReadCount: 22,
//       commentCount: 11,
//       likeCount: 1100,
//       member: {
//         memNickname: "허재호",
//       },
//     },
//   ];

//   // 정렬 핸들러
//   const handleSortChange = (e) => {
//     setSortOrder(e.target.value);
//   };

//   // 글 작성하기 핸들러
//   const handleWrite = () => {
//     navigate("/board/write");
//   };

//   // searchTerm이 바뀔 때마다 실시간 필터링
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setIsSearchMode(false); // 검색어 없으면 전체 목록 보여줌
//       setFilteredBoards([]); // 이전 검색결과 초기화
//     } else {
//       const result = boards.filter(
//         (board) =>
//           board.boardTitle.includes(searchTerm) ||
//           board.boardContent.includes(searchTerm)
//       );
//       setFilteredBoards(result);
//       setIsSearchMode(true);
//     }
//   }, [searchTerm, boards]); // boards도 의존성에 포함

//   // 더미데이터
//   // 정렬 기준이 바뀔 때마다 정렬된 boards 설정
//   useEffect(() => {
//     const sorted = [...dummyBoards];

//     switch (sortOrder) {
//       case "latest":
//         sorted.sort((a, b) => b.boardNo - a.boardNo);
//         break;
//       case "oldest":
//         sorted.sort((a, b) => a.boardNo - b.boardNo);
//         break;
//       case "likes":
//         sorted.sort((a, b) => b.likeCount - a.likeCount);
//         break;
//       case "comments":
//         sorted.sort((a, b) => b.commentCount - a.commentCount);
//         break;
//       default:
//         break;
//     }

//     // 정렬 완료 후 세팅
//     setBoards(sorted);
//     setIsLoading(false);
//   }, [sortOrder]);

//   return (
//     <div className={BoardCss.boardListPage}>
//       {/* 섹션 헤더 */}
//       <SectionHeader title="취준진담" />

//       {/* 정렬 및 검색창 컨테이너 */}
//       <div className={BoardCss.controls}>
//         <select
//           className={BoardCss.sortSelect}
//           value={sortOrder}
//           onChange={handleSortChange}
//         >
//           <option value="latest">최신순</option>
//           <option value="oldest">오래된순</option>
//           <option value="likes">좋아요순</option>
//           <option value="comments">댓글순</option>
//         </select>

//         <div className="search-box">
//           <i className="fa-solid fa-magnifying-glass"></i>
//           <input
//             type="text"
//             placeholder="진중한 취업이야기, 취준진담"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)} // 입력할 때마다 상태 변경
//           />
//         </div>
//       </div>

//       {/* BoardList 넘겨주기 */}
//       {isSearchMode ? (
//         filteredBoards.length > 0 ? (
//           <BoardList boards={filteredBoards} />
//         ) : (
//           <p className={BoardCss.noResult}>검색 결과가 없습니다.</p>
//         )
//       ) : (
//         <BoardList boards={boards} />
//       )}

//       <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
//     </div>
//   );
// }
//----------------------------------------------------------
// 서버 구현하면 주석 풀기!! (위에 더미데이터 제거)
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardList from "../../components/board/BoardList";
import BoardCss from "./BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate } from "react-router-dom";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
// import { useContext } from "react";
// import { AuthContext } from "../../contexts/AuthContext"; // AuthContext 사용 시 loginUser 가져오기

export default function BoardListPage() {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isloading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState("");
  // const { loginUser } = useContext(AuthContext); // AuthContext 사용 시 loginUser 가져오기
  // const loginUser = JSON.parse(localStorage.getItem("loginUser")); // localStorage 또는 sessionStorage에서 꺼내는 경우
  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태
  const navigate = useNavigate();
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 게시글 목록 불러오기 (정렬 + 검색)
  const getBoardList = async () => {
    try {
      console.log("요청 파라미터:", { sort: sortOrder, query: searchTerm });

      const resp = await axiosApi.get("/board/boardList", {
        params: { sort: sortOrder, query: searchTerm },
      });

      console.log("서버 응답:", resp.data);

      if (resp.status === 200) {
        setBoards(resp.data);
      }
    } catch (error) {
      console.error("게시글 목록 조회 중 에러 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 바뀌면 새로 불러오기
  useEffect(() => {
    getBoardList();
  }, [sortOrder]);

  // searchTerm이 바뀔 때마다 실시간 검색
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsSearchMode(false);
      setFilteredBoards([]);
    } else {
      const result = boards.filter(
        (board) =>
          board.boardTitle.includes(searchTerm) ||
          board.boardContent.includes(searchTerm)
      );
      setFilteredBoards(result);
      setIsSearchMode(true);
    }
  }, [searchTerm, boards]);

  // 정렬 선택
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // 글 작성하기 버튼
  const handleWrite = () => {
    navigate("/board/write");
  };

  if (isloading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={BoardCss.boardListPage}>
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담" />

      {/* 정렬 및 검색창 컨테이너 */}
      <div className={BoardCss.controls}>
        <select
          className={BoardCss.sortSelect}
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="likes">좋아요순</option>
          <option value="comments">댓글순</option>
        </select>

        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="진중한 취업이야기, 취준진담"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 검색 결과 유무에 따른 조건 렌더링 */}
      {isSearchMode ? (
        filteredBoards.length > 0 ? (
          <BoardList boards={filteredBoards} />
        ) : (
          <p className={BoardCss.noResult}>검색 결과가 없습니다.</p>
        )
      ) : (
        <BoardList boards={boards} />
      )}

      <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
    </div>
  );
}
