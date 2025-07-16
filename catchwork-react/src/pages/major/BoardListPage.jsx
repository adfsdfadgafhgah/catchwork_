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

import InfiniteScroll from "react-infinite-scroll-component";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 검색 실행에 사용

  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부 확인인

  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태
  const navigate = useNavigate();
  const { memNo } = useOutletContext();

  // API 호출 로직
  const getBoardList = async (pageNum = 1, isNewSearch = false) => {
    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/board/boardList", {
        params: {
          sort: sortOrder,
          query: confirmedSearchTerm,
          memNo: memNo, // props로 받은 memNo 사용
          page: pageNum,
          size: 10, // 10개씩
        },
      });

      if (resp.status === 200) {
        const newBoards = resp.data;
        if (isNewSearch) {
          setBoards(newBoards);
        } else {
          setBoards((prev) => [...prev, ...newBoards]);
        }
        setHasMore(newBoards.length === 10); // 10개 미만이면 더 없음
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
    setBoards([]);
    setPage(1);
    setHasMore(true);
    getBoardList(1, true);
  }, [sortOrder, confirmedSearchTerm, memNo]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getBoardList(nextPage);
  };

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

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>
    );
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

      <InfiniteScroll
        dataLength={boards.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className={BoardCss.noResult}>더 이상 게시글이 없습니다.</p>
        }
      >
        <BoardList boards={boards} memNo={memNo} />
      </InfiniteScroll>

      <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
      <ScrollToTopButton />
    </div>
  );
}
