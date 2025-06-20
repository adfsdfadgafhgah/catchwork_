import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardList from "../../components/board/BoardList";
import BoardCss from "./BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isloading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 깡 데이터
  const dummyBoards = [
    {
      boardNo: 1,
      boardTitle: "첫 번째 글은 들어가짐",
      boardContent: "디테일로 왔음",
      boardWriteDate: "1일 전",
      boardReadCount: 1,
      commentCount: 2,
      likeCount: 3,
      member: {
        memNickname: "으후루꾸꾸루후으으후",
      },
    },
    {
      boardNo: 2,
      boardTitle: "취업도전 100번 째... 실패만 한다면?",
      boardContent: "그냥 포기하고 행복한 백수로 살아보세요",
      boardWriteDate: "1일 전",
      boardReadCount: 100,
      commentCount: 23,
      likeCount: 14,
      member: {
        memNickname: "으후루꾸꾸루후으으후",
      },
    },
    {
      boardNo: 3,
      boardTitle: "취업도전 100번 째... 실패만 한다면?",
      boardContent: "그냥 포기하고 행복한 백수로 살아보세요",
      boardWriteDate: "1일 전",
      boardReadCount: 100,
      commentCount: 23,
      likeCount: 14,
      member: {
        memNickname: "으후루꾸꾸루후으으후",
      },
    },
  ];

  // // 게시글 목록 조회용 함수
  // const getBoardList = async () => {
  //   try {
  //     const resp = await axiosApi.get("/board/boardList");
  //     console.log(resp.data);

  //     if (resp.status === 200) {
  //       setBoards(resp.data);
  //     }
  //   } catch (error) {
  //     console.log("게시글 목록 조회 중 에러 발생 : ", error);
  //   }
  // };

  // 깡데이터
  useEffect(() => {
    // setTimeout으로 비동기 시뮬레이션
    setTimeout(() => {
      setBoards(dummyBoards);
    }); // 1초 후 로딩 끝

    // 언마운트 시 cleanup
    return () => setBoards([]);
  }, []);

  useEffect(() => {
    if (boards.length > 0) {
      setIsLoading(false);
    }
  }, [boards]);

  if (isloading) {
    return <h1>Loading...</h1>;
  }

  // // 컴포넌트가 처음 렌더링 될 때 useEffect
  // useEffect(() => {
  //   getBoardList();
  // }, []);

  // // boards 상태가 변경될 때 실행될 useEffect (isLoading값 변경)
  // useEffect(() => {
  //   if (boards != null) {
  //     setIsLoading(false);
  //   }
  // }, [boards]);

  // if (isloading) {
  //   return <h1>Loading...</h1>;
  // }

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim() !== "") {
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  return (
    <div className={BoardCss.boardListPage}>
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담" />

      {/* 정렬 및 검색창 컨테이너 */}
      <div className={BoardCss.controls}>
        <select
          className={BoardCss.sortSelect}
          onChange={(e) => console.log("정렬 선택:", e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="likes">좋아요순</option>
          <option value="comments">댓글순</option>
        </select>

        <div className={BoardCss.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="진중한 취업이야기, 취준진담"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* BoardList 넘겨주기 */}
      <BoardList boards={boards} />
    </div>
  );
}
