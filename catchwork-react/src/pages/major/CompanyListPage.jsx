import { useState, useEffect } from "react";
import axios from "axios";

import SectionHeader from "../../components/common/SectionHeader";
import CompanyItem from "../../components/company/CompanyItem";
import "./CompanyListPage.css";

const CompanyListPage = () => {
  const [companyList, setCompanyList] = useState([
    {
      // 가데이터 넣어서 확인하는중임
      corpNo: 1,
      corpName: "KH 정보교육원 종로",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      recruitCount: 1,
      views: 120,
      favs: 70,
    },
    {
      corpNo: 2,
      corpName: "KH 정보교육원 강남",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      recruitCount: 2,
      views: 120,
      favs: 70,
    },
    {
      corpNo: 3,
      corpName: "KH 정보교육원 의정부",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      recruitCount: 3,
      views: 120,
      favs: 70,
    },
    {
      corpNo: 4,
      corpName: "KH 정보교육원 인천",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      recruitCount: 4,
      views: 120,
      favs: 70,
    },
    {
      corpNo: 5,
      corpName: "KH 정보교육원 신촌",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      recruitCount: 5,
      views: 120,
      favs: 70,
    },
    {
      corpNo: 6,
      corpName: "KH 정보교육원 노원",
      corpType: "중소기업",
      corpLogo: "/src/assets/icon.png",
      recruitCount: 6,
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
            <CompanyItem key={company.corpNo} company={company} />
          ))}
        </div>
      </main>
    </>
  );
};

export default CompanyListPage;
