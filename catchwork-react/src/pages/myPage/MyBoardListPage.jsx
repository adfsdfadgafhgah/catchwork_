import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import BoardList from "../../components/board/BoardList";
import BoardCss from "../major/BoardListPage.module.css";
import styles from "../major/BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import InfiniteScroll from "react-infinite-scroll-component";

const MyBoardListPage = () => {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const { memNo } = useOutletContext(); // 로그인 사용자
  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태

  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 존재 여부

  useEffect(() => {
    getMyBoardList(); // 로그인 여부 관계없이 항상 호출
  }, [sortOrder, memNo]);

  // memNo가 변경될 때마다 API 호출
  useEffect(() => {
    setBoards([]);
    setPage(1);
    setHasMore(true);
    getMyBoardList(1, true);
  }, [sortOrder, searchTerm, memNo]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getMyBoardList(nextPage);
  };

  // 정렬 선택
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // 즐겨찾기 게시글 목록 조회
  const getMyBoardList = async (pageNum = 1, isNewSearch = false) => {
    const requestData = {
      sort: sortOrder,
      query: searchTerm,
      memNo: memNo,
      page: pageNum,
      size: 10,
    };

    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/myPage/myBoardList", {
        params: requestData,
      });

      if (resp.status === 200) {
        const newBoards = resp.data;
        if (isNewSearch) {
          setBoards(newBoards);
        } else {
          setBoards((prev) => [...prev, ...newBoards]);
        }
        setHasMore(newBoards.length === 10);
      }
    } catch (error) {
      console.error("게시글 목록 조회 중 에러 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 입력 후 엔터 누르면 검색
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value.trim());
      getMyBoardList();
    }
  };

  // 로딩 중...
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>
    );
  }

  return (
    <div
      className={BoardCss.boardListPage}
      style={{ margin: 0, width: "100%" }}
    >
      {/* 섹션 헤더 */}
      <SectionHeader title="내가 작성한 게시글" />
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
            onKeyUp={handleSearch}
          />
        </div>
      </div>

      {/* 결과 영역 */}
      <InfiniteScroll
        dataLength={boards.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className={styles.noResult}>더 이상 게시글이 없습니다.</p>
        }
      >
        <BoardList boards={boards} memNo={memNo} />
      </InfiniteScroll>

      <ScrollToTopButton />
    </div>
  );
};

export default MyBoardListPage;
