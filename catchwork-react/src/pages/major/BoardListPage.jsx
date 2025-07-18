import { useEffect, useState, useCallback, useRef } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardList from "../../components/board/BoardList";
import styles from "./BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate, useOutletContext } from "react-router-dom";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import InfiniteScroll from "react-infinite-scroll-component";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const isFetching = useRef(false);

  const navigate = useNavigate();
  const { memNo } = useOutletContext();

  // API 호출 함수
  const getBoardList = useCallback(
    async (pageNum, isNewSearch = false) => {
      if (isFetching.current) {
        return;
      }

      isFetching.current = true;
      if (isNewSearch) {
        setIsLoading(true);
      }

      try {
        const resp = await axiosApi.get("/board/boardList", {
          params: {
            sort: sortOrder,
            query: confirmedSearchTerm,
            memNo: memNo,
            page: pageNum,
            size: 10,
          },
        });

        if (resp.status === 200) {
          const newBoards = resp.data;

          // [수정] 데이터를 추가하기 전에 중복을 제거하는 로직 추가
          setBoards((prevBoards) => {
            if (isNewSearch) {
              return newBoards; // 새 검색이면 그냥 덮어쓰기
            } else {
              // 기존 boardNo들을 Set으로 만들어 빠른 조회를 가능하게 함
              const existingBoardNos = new Set(
                prevBoards.map((b) => b.boardNo)
              );
              // 새로 받아온 데이터 중에서, 기존 목록에 없는 것만 필터링
              const uniqueNewBoards = newBoards.filter(
                (b) => !existingBoardNos.has(b.boardNo)
              );
              // 중복이 제거된 새 데이터만 기존 목록에 추가
              return [...prevBoards, ...uniqueNewBoards];
            }
          });

          setHasMore(newBoards.length === 10);
        }
      } catch (error) {
        console.error("게시글 목록 조회 중 에러 발생:", error);
        setHasMore(false);
      } finally {
        isFetching.current = false;
        if (isNewSearch) {
          setIsLoading(false);
        }
      }
    },
    [sortOrder, confirmedSearchTerm, memNo]
  );

  // 필터, 검색어, 로그인 상태 변경 시 목록 리셋
  useEffect(() => {
    isFetching.current = false;
    setBoards([]);
    setPage(1);
    setHasMore(true);
    getBoardList(1, true);
  }, [sortOrder, confirmedSearchTerm, memNo, getBoardList]);

  // 추가 데이터 로딩 함수
  const fetchMoreData = () => {
    if (!hasMore || isFetching.current) {
      return;
    }

    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getBoardList(nextPage, false);
      return nextPage;
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() !== confirmedSearchTerm) {
        setConfirmedSearchTerm(searchTerm.trim());
      }
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleWrite = () => {
    if (!memNo) {
      alert("로그인 후 이용해주세요");
      navigate("/signin");
      return;
    }
    navigate("/board/write");
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <span>게시글을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className={styles.boardListPage}>
      <SectionHeader title="취준진담" />

      <div className={styles.controls}>
        <select
          className={styles.sortSelect}
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="views">조회수순</option>
          <option value="likes">좋아요순</option>
          <option value="comments">댓글순</option>
        </select>

        <div className={styles.searchBox}>
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
        loader={
          <h4 style={{ textAlign: "center", margin: "20px 0" }}>Loading...</h4>
        }
        endMessage={
          boards.length > 0 ? (
            <p className={styles.noResult}>더 이상 게시글이 없습니다.</p>
          ) : null
        }
      >
        <BoardList boards={boards} memNo={memNo} />
      </InfiniteScroll>

      {!isLoading && boards.length === 0 && (
        <p className={styles.noResult}>조건에 맞는 게시글이 없습니다.</p>
      )}

      <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
      <ScrollToTopButton />
    </div>
  );
}
