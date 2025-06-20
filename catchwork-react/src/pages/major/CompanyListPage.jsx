import { useState, useEffect } from "react";
import axios from "axios";

import SectionHeader from "../../components/common/SectionHeader";
import CompanyCard from "../../components/common/CompanyCard";
import "./CompanyListPage.css";

const CompanyListPage = () => {
  const [companyList, setCompanyList] = useState([
    {
      // 가데이터 넣어서 확인하는중임
      corpRegNo: 1,
      corpName: "KH 정보교육원 종로",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      views: 120,
      favs: 70,
    },
    {
      corpRegNo: 2,
      corpName: "KH 정보교육원 강남",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      views: 120,
      favs: 70,
    },
    {
      corpRegNo: 3,
      corpName: "KH 정보교육원 의정부",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      views: 120,
      favs: 70,
    },
    {
      corpRegNo: 4,
      corpName: "KH 정보교육원 인천",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      views: 120,
      favs: 70,
    },
    {
      corpRegNo: 5,
      corpName: "KH 정보교육원 신촌",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      views: 120,
      favs: 70,
    },
    {
      corpRegNo: 6,
      corpName: "KH 정보교육원 노원",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      views: 120,
      favs: 70,
    },
    // ... 더미 데이터 추가 가능
  ]);

  return (
    <>
      <main className="container">
        <div className="section-header-with-search">
          <SectionHeader title="기업정보" />

          <div className="search-box">
            <button>검색</button>
            <input type="text" placeholder="진정한 취업이야기, 취준진담" />
          </div>
        </div>

        {/* 기업 카드 리스트 */}
        <div className="company-grid">
          {companyList.map((company) => (
            <CompanyCard key={company.corpRegNo} company={company} />
          ))}
        </div>
      </main>
    </>
  );
};

export default CompanyListPage;
