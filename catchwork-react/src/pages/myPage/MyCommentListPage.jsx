import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import MyCommentList from "../../components/myPage/MyCommentList";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import BoardCss from "../major/BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import InfiniteScroll from "react-infinite-scroll-component";

const MyCommentListPage = () => {
  const { memNo } = useOutletContext();
  // const [isloading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const [comments, setComments] = useState([]); // 댓글 목록 조회

  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 존재 여부

  useEffect(() => {
    getMyCommentList();
  }, [memNo]);

  // memNo가 변경될 때마다 API 호출
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    getMyCommentList(1, true);
  }, [searchTerm, memNo]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getMyCommentList(nextPage);
  };

  // 댓글 목록 조회
  const getMyCommentList = async (pageNum = 1, isNewSearch = false) => {
    const resp = await axiosApi.get("/myPage/myCommentList", {
      params: { memNo: memNo, query: searchTerm, page: pageNum, size: 10 },
    });
    if (resp.status === 200) {
      if (isNewSearch) {
        setComments(resp.data);
      } else {
        setComments((prev) => [...prev, ...resp.data]);
      }
      setHasMore(resp.data.length === 10);
    }
    // setIsLoading(false);
  };

  // 검색
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value.trim());
      getMyCommentList();
    }
  };

  return (
    <div
      className={BoardCss.boardListPage}
      style={{ margin: 0, width: "100%" }}
    >
      {/* 섹션 헤더 */}
      <SectionHeader title="내가 작성한 댓글" />
      <div className={BoardCss.controls} style={{ justifyContent: "flex-end" }}>
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

      <InfiniteScroll
        dataLength={comments.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className={BoardCss.noResult}>더 이상 댓글이 없습니다.</p>
        }
      >
        <MyCommentList
          comments={comments}
          memNo={memNo}
          onRefresh={getMyCommentList}
        />
      </InfiniteScroll>

      <ScrollToTopButton />
    </div>
  );
};

export default MyCommentListPage;
