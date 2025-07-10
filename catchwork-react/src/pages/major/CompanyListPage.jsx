import { useState, useEffect } from "react";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import SectionHeader from "../../components/common/SectionHeader";
import CompanyItem from "../../components/company/CompanyItem";
import "./CompanyListPage.css";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";

const CompanyListPage = () => {
  const { loginMember, setLoginMember } = useLoginMember(); // 로그인 유저 정보
  const [companyList, setCompanyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 최초 마운트 시 정보 fetch
  useEffect(() => {
    if (!loginMember || !loginMember.memNo) {
      setLoginMember();
    }
  }, []);

  // loginMember가 실제로 업데이트 되었을 때만 기업 리스트 불러오기
  useEffect(() => {
    console.log("loginMember 세팅됨:", loginMember);
    getCorpList();
  }, [loginMember]);

  //기업 목록
  const getCorpList = async () => {
    setLoading(true);

    try {
      const params = {};

      if (loginMember && loginMember.memNo) {
        params.memNo = loginMember.memNo; // 로그인한 경우만 memNo 전달
      }

      if (searchTerm && searchTerm.trim()) {
        params.query = searchTerm.trim(); //검색어 전달
      }

      const res = await axiosApi.get("/company", { params });

      if (res.status === 200) {
        console.log("보내는 params(loginMember):", params); //로그인멤버가 자꾸 null로 떠서 추가함
        console.log("기업 목록 데이터 확인:", res.data);
        setCompanyList(res.data);
      } else if (res.status === 204) {
        setCompanyList([]);
        console.log("조회된 기업 정보가 없습니다.");
      } else {
        alert("기업 목록 조회 실패");
      }
    } catch (err) {
      console.error("기업 정보 로딩 실패:", err);
      alert("기업 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 검색어 바뀔 때마다 요청 보내기
  useEffect(() => {
    console.log(" useEffect 실행", loginMember, searchTerm);

    if (searchTerm.trim() === "") {
      setIsSearchMode(false);
      setFilteredCompanies([]);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();

      const result = companyList.filter(
        (company) =>
          company.corpName?.toLowerCase().includes(lowerSearchTerm) ||
          company.corpType?.toLowerCase().includes(lowerSearchTerm) ||
          company.corpAddr?.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredCompanies(result);
      setIsSearchMode(true);
    }
  }, [searchTerm, companyList]);

  return (
    <>
      <main className="container">
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
        {loading ? (
          <p style={{ textAlign: "center" }}>로딩 중...</p>
        ) : isSearchMode ? (
          filteredCompanies.length > 0 ? (
            <div className="company-grid">
              {filteredCompanies.map((company) => (
                <CompanyItem key={company.corpNo} company={company} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>검색 결과가 없습니다.</p>
          )
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

export default CompanyListPage;
