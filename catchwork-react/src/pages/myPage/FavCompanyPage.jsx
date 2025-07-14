import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosApi } from "../../api/axiosAPI";
import CompanyItem from "../../components/company/CompanyItem";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";

const FavCompanyPage = () => {
  const { memNo } = useOutletContext();
  const [companyList, setCompanyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCorpList();
  }, [memNo]);

  //기업 목록
  const getCorpList = async () => {
    setIsLoading(true);

    try {
      const params = {
        memNo: memNo,
        query: searchTerm.trim(),
      };

      const resp = await axiosApi.get("/myPage/favCorpList", { params });

      if (resp.status === 200) {
        setCompanyList(resp.data);
      } else if (resp.status === 204) {
        setCompanyList([]);
      } else {
        alert("기업 목록 조회 실패");
      }
    } catch (err) {
      alert("기업 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 입력 후 엔터 누르면 검색
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value);
      getCorpList();
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>
    );
  }

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
        {isLoading ? (
          <p style={{ textAlign: "center" }}>로딩 중...</p>
        ) : (
          <div className="company-grid">
            {companyList.length > 0 ? (
              companyList.map((company) => (
                <CompanyItem key={company.corpNo} company={company} />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>기업 정보가 없습니다.</p>
            )}
          </div>
        )}
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default FavCompanyPage;
