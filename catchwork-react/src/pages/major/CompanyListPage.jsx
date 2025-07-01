import { useState, useEffect } from "react";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import SectionHeader from "../../components/common/SectionHeader";
import CompanyItem from "../../components/company/CompanyItem";
import "./CompanyListPage.css";
import { axiosApi } from "../../api/axiosAPI";

//const CompanyListPage = () => {
// const [companyList, setCompanyList] = useState([
//   // 가데이터 넣어서 확인하는중임
//   {
//     corpNo: 1,
//     corpName: "KH 정보교육원 종로",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 1,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 2,
//     corpName: "KH 정보교육원 강남",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 2,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 3,
//     corpName: "KH 정보교육원 의정부",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 3,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 4,
//     corpName: "KH 정보교육원 인천",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 4,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 5,
//     corpName: "KH 정보교육원 신촌",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 5,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 6,
//     corpName: "KH 정보교육원 노원",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 6,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 1,
//     corpName: "KH 정보교육원 종로",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 1,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 2,
//     corpName: "KH 정보교육원 강남",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 2,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 3,
//     corpName: "KH 정보교육원 의정부",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 3,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 4,
//     corpName: "KH 정보교육원 인천",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 4,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 5,
//     corpName: "KH 정보교육원 신촌",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 5,
//     views: 120,
//     favs: 70,
//   },
//   {
//     corpNo: 6,
//     corpName: "KH 정보교육원 노원",
//     corpType: "중소기업",
//     corpLogo: "/src/assets/icon.png",
//     recruitCount: 6,
//     views: 120,
//     favs: 70,
//   },
// ]);
const CompanyListPage = () => {
  const [companyList, setCompanyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  //기업 목록

  const getCorpList = async () => {
    setLoading(true);
    try {
      const memNo = "49d354c4-bd52-4cdb-8fe5-a7ff69454b16";
      const params = { memNo };

      if (searchTerm && searchTerm.trim()) {
        params.query = searchTerm.trim();
      }

      const res = await axiosApi.get("/company", { params });

      if (res.status === 200) {
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
    getCorpList();
  }, [searchTerm]);

  return (
    <>
      <main className="container">
        <div className="section-header-with-search">
          <SectionHeader title="기업정보" noBorder />
          <div className="search-box">
            <button>검색</button>
            <input
              type="text"
              placeholder="진중한 이야기, 취중진담키키"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 기업 카드 리스트 */}
        {loading ? (
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

export default CompanyListPage;
