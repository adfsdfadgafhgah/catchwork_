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
import useLoginMember from "../../stores/loginMember";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isloading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const { loginMember, setLoginMember } = useLoginMember(); // 로그인 사용자
  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginMember?.memNo) {
      setLoginMember(); // 로그인 정보 세팅
    }
  }, []);

  useEffect(() => {
    getBoardList(); // 로그인 여부 관계없이 항상 호출
  }, [sortOrder, loginMember?.memNo]);

  // 게시글 목록 불러오기 (정렬 + 검색)
  const getBoardList = async () => {
    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/board/boardList", {
        params: {
          sort: sortOrder,
          query: searchTerm,
          memNo: loginMember?.memNo || "",
        },
      });

      if (resp.status === 200) {
        setBoards(resp.data);
      }
    } catch (error) {
      console.error("게시글 목록 조회 중 에러 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!loginMember.memNo) {
      alert("로그인 후 이용해주세요");
      navigate("/signin");
      return;
    }
    navigate("/board/write");
  };

  // 로딩 중...
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
          <option value="views">조회수순</option>
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
          <BoardList boards={filteredBoards} loginMember={loginMember} />
        ) : (
          <p className={BoardCss.noResult}>검색 결과가 없습니다.</p>
        )
      ) : (
        <BoardList
          key={loginMember?.memNo}
          boards={boards}
          loginMember={loginMember}
        />
      )}

      <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
    </div>
  );
}
