//----------------------------------------------------------
// 서버 구현하면 주석 풀기!! (위에 더미데이터 제거)
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardList from "../../components/board/BoardList";
import BoardCss from "./BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate, useOutletContext } from "react-router-dom";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
// import useLoginMember from "../../stores/loginMember";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 검색 실행에 사용
  // const { loginMember, setLoginMember } = useLoginMember(); // 로그인 사용자
  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태
  const navigate = useNavigate();
  const { memNo } = useOutletContext();

  // API 호출 로직
  const getBoardList = async () => {
    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/board/boardList", {
        params: {
          sort: sortOrder,
          query: confirmedSearchTerm,
          memNo: memNo, // props로 받은 memNo 사용
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

  // memNo가 변경될 때마다 API 호출
  useEffect(() => {
    // memNo가 초기 로딩될 때 (null 또는 값) API 호출이 한 번만 일어나도록 함
    // 이렇게 하면 로그인 상태가 변경될 때마다 정확히 새로고침됩니다.
    getBoardList();
  }, [sortOrder, confirmedSearchTerm, memNo]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setConfirmedSearchTerm(searchTerm.trim());
    }
  };

  // 정렬 선택
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // 글 작성하기 버튼
  const handleWrite = () => {
    console.log("memNo : ", memNo);
    if (!memNo) {
      alert("로그인 후 이용해주세요");
      navigate("/signin");
      return;
    }
    navigate("/board/write");
  };

  // 로딩 중...
  if (isLoading) {
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
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* 검색 결과 유무에 따른 조건 렌더링 */}
      {isLoading ? (
        <h1>Loading...</h1>
      ) : boards.length > 0 ? (
        <BoardList boards={boards} memNo={memNo} />
      ) : (
        <p className={BoardCss.noResult}>검색 결과가 없습니다.</p>
      )}

      <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />

      <ScrollToTopButton />
    </div>
  );
}
