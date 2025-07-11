import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import BoardList from "../../components/board/BoardList";
import BoardCss from "../major/BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";

const MyBoardListPage = () => {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isloading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const { loginMember } = useOutletContext(); // 로그인 사용자
  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 기준 상태

  useEffect(() => {
    getMyBoardList(); // 로그인 여부 관계없이 항상 호출
  }, [sortOrder, loginMember?.memNo]);

  // 정렬 선택
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // 즐겨찾기 게시글 목록 조회
  const getMyBoardList = async () => {
    const requestData = {
      memNo: loginMember?.memNo,
      sort: sortOrder,
      query: searchTerm,
    };

    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/myPage/myBoardList", {
        params: requestData,
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

  // 검색어 입력 후 엔터 누르면 검색
  const handleSearch = (e) => {
    if (e.target.value.trim() !== "" && e.key === "Enter") {
      setSearchTerm(e.target.value.trim());
      getMyBoardList();
    }
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
            onKeyUp={handleSearch}
          />
        </div>
      </div>
      {boards.length > 0 ? (
        <BoardList boards={boards} loginMember={loginMember} />
      ) : (
        <p className={BoardCss.noResult}>검색 결과가 없습니다.</p>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default MyBoardListPage;
