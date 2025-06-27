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

  //기업 목록

  const getCorpList = async () => {
    try {
      //const token = localStorage.getItem("jwt"); // JWT가 있다면 사용
      // const res = await axios.get("http://localhost:8080/company", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const res = await axiosApi.get("/company", {
        params: searchTerm.trim() ? { query: searchTerm } : {}, //  검색어 있을 때만 쿼리 파라미터 추가
      });

      if (res.status === 200) {
        console.log("기업 목록 데이터 확인:", res.data); // 👈 여기서 부터 아래가 console로 확인중 나중에 지울게요
        console.log("데이터 타입:", Array.isArray(res.data));
        console.log("타입이 배열인가?:", Array.isArray(res.data));
        console.log("typeof data:", typeof res.data);
        setCompanyList(res.data);
      } else {
        alert(res.data);
      }
    } catch (err) {
      console.error("기업 정보 로딩 실패:", err);
      alert("기업 정보를 불러오는 데 실패했습니다.");
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
        <div className="company-grid">
          {companyList.map((company) => (
            <CompanyItem key={company.corpNo} company={company} />
          ))}
        </div>
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default CompanyListPage;
