import { useState, useEffect } from "react";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import SectionHeader from "../../components/common/SectionHeader";
import CompanyItem from "../../components/company/CompanyItem";
import "./CompanyListPage.css";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";
import InfiniteScroll from "react-infinite-scroll-component";

const CompanyListPage = () => {
  const { loginMember, setLoginMember } = useLoginMember(); // 로그인 유저 정보
  const [companyList, setCompanyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부 확인

  // searchTerm 또는 loginMember가 바뀔 때마다 API 재호출
  useEffect(() => {
    if (!loginMember || !loginMember.memNo) return; // loginMember 준비 안 된 경우 무시

    const delayDebounce = setTimeout(() => {
      getCorpList(1, true); // 서버에 요청
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, loginMember]);

  // loginMember가 실제로 업데이트 되었을 때만 기업 리스트 불러오기
  useEffect(() => {
    // console.log("loginMember 세팅됨:", loginMember);
    getCorpList(1, true);
  }, [loginMember]);

  //기업 목록
  const getCorpList = async (pageNum = 1, isNewSearch = false) => {
    try {
      setLoading(true);
      const params = {};
      if (loginMember && loginMember.memNo) {
        params.memNo = loginMember.memNo; // 로그인한 경우만 memNo 전달
      }
      if (searchTerm && searchTerm.trim()) {
        params.query = searchTerm.trim(); //검색어 전달
      }
      params.page = pageNum;
      params.size = 9;
      const res = await axiosApi.get("/company", { params });

      if (res.status === 200) {
        const newCorpInfo = res.data;
        if (isNewSearch) {
          setCompanyList(newCorpInfo);
        } else {
          setCompanyList((prev) => [...prev, ...newCorpInfo]);
        }
        setHasMore(newCorpInfo.length === 9);
      } else if (res.status === 204) {
        setCompanyList([]);
        setHasMore(false);
        console.log("조회된 기업 정보가 없습니다.");
      } else {
        alert("기업 목록 조회 실패");
      }
    } catch (err) {
      // console.error("기업 정보 로딩 실패:", err);
      alert("기업 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 무한 스크롤을 위한 추가 데이터 로드
  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getCorpList(nextPage);
  };

  // searchTerm이 변경될 때마다 기업 리스트 다시 요청
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      getCorpList(1, true);
    }, 300); // 입력 후 300ms 지연 (디바운싱)

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>
      <main className="company-container">
        <div className="section-header-with-search">
          <SectionHeader title="기업정보" noBorder />
          <div className="search-box">
            <button>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <input
              type="text"
              placeholder="진중한 이야기, 취중진담"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 기업 카드 리스트 */}
        {loading && companyList.length === 0 ? (
          <p style={{ textAlign: "center" }}>로딩 중...</p>
        ) : (
          <InfiniteScroll
            dataLength={companyList.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: "center" }}>로딩 중...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                {companyList.length === 0
                  ? "기업 정보가 없습니다."
                  : "더 이상 기업 정보가 없습니다."}
              </p>
            }
          >
            <div className="company-grid">
              {companyList.map((company) => (
                <CompanyItem key={company.corpNo} company={company} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default CompanyListPage;
