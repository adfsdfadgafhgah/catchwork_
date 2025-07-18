import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosApi } from "../../api/axiosAPI";
import CompanyItem from "../../components/company/CompanyItem";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardCss from "../major/BoardListPage.module.css";

const FavCompanyPage = () => {
  const { memNo } = useOutletContext();
  const [companyList, setCompanyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 존재 여부

  useEffect(() => {
    getCorpList();
  }, [memNo]);

  // memNo가 변경될 때마다 API 호출
  useEffect(() => {
    setCompanyList([]);
    setPage(1);
    setHasMore(true);
    getCorpList(1, true);
  }, [searchTerm, memNo]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getCorpList(nextPage);
  };

  //기업 목록
  const getCorpList = async (pageNum = 1, isNewSearch = false) => {
    // setIsLoading(true);

    try {
      const params = {
        memNo: memNo,
        query: searchTerm.trim(),
        page: pageNum,
        size: 12,
      };

      const resp = await axiosApi.get("/myPage/favCorpList", { params });

      if (resp.status === 200) {
        if (isNewSearch) {
          setCompanyList(resp.data);
        } else {
          setCompanyList((prev) => [...prev, ...resp.data]);
        }
        setHasMore(resp.data.length === 12);
      } else if (resp.status === 204) {
        setCompanyList([]);
      } else {
        alert("기업 목록 조회 실패");
      }
    } catch (err) {
      alert("기업 정보를 불러오는 데 실패했습니다.");
    } finally {
      // setIsLoading(false);
    }
  };

  // 검색어 입력 후 엔터 누르면 검색
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value);
      getCorpList();
    }
  };

  /*
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>
    );
  }
  */

  return (
    <>
      <main className="container">
        <div className="section-header-with-search">
          <SectionHeader title="기업정보" noBorder />
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="검색 키워드를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={handleSearch}
            />
          </div>
        </div>

        {/* 기업 카드 리스트 */}
        <InfiniteScroll
          dataLength={companyList.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p className={BoardCss.noResult}>더 이상 기업 정보가 없습니다.</p>
          }
        >
          <div className="company-grid">
            {companyList.length > 0 ? (
              companyList.map((company) => (
                <CompanyItem key={company.corpNo} company={company} />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>기업 정보가 없습니다.</p>
            )}
          </div>
        </InfiniteScroll>
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default FavCompanyPage;
