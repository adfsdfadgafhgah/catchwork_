import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import MyCommentList from "../../components/myPage/MyCommentList";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import BoardCss from "../major/BoardListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";

const MyCommentListPage = () => {
  const { memNo } = useOutletContext();
  const [isloading, setIsLoading] = useState(true); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색
  const [comments, setComments] = useState([]); // 댓글 목록 조회

  useEffect(() => {
    getMyCommentList();
  }, [memNo]);

  // 댓글 목록 조회
  const getMyCommentList = async () => {
    const resp = await axiosApi.get("/myPage/myCommentList", {
      params: { memNo: memNo, query: searchTerm },
    });
    if (resp.status === 200) {
      setComments(resp.data);
    }
    setIsLoading(false);
  };

  // 검색
  const handleSearch = (e) => {
    if (e.target.value.trim() !== "" && e.key === "Enter") {
      setSearchTerm(e.target.value.trim());
      getMyCommentList();
    }
  };

  return (
    <div className={BoardCss.boardListPage}>
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담" />
      <div className={BoardCss.controls}>
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
      {isloading ? (
        <div className={BoardCss.loading}>
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      ) : comments.length > 0 ? (
        <MyCommentList
          comments={comments}
          memNo={memNo}
          onRefresh={getMyCommentList}
        />
      ) : (
        <p>작성한 댓글이 없습니다</p>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default MyCommentListPage;
