import React, { useState } from "react";
import RecruitItem from "./RecruitItem";
import Pagination from "./../common/Pagination";
import "./RecruitList.css";

const RecruitList = () => {
  const [filters, setFilters] = useState({
    location: "",
    field: "",
    experience: "",
    education: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // 샘플 데이터
  const recruitData = [
    {
      id: 1,
      title: "KH 개발자 인턴십 모집",
      company: "KH 정보교육원 종로",
      category: "서울특별시",
      field: "career · education",
      date: "2024.01.09",
      views: 0,
      comments: 23,
      likes: 0,
      isNew: true,
    },
    {
      id: 2,
      title: "KH 개발자 인턴십 모집",
      company: "KH 정보교육원 종로",
      category: "서울특별시",
      field: "career · education",
      date: "2024.01.09",
      views: 0,
      comments: 24,
      likes: 0,
      isNew: true,
    },
    {
      id: 3,
      title: "KH 개발자 인턴십 모집",
      company: "KH 정보교육원 종로",
      category: "서울특별시",
      field: "career · education",
      date: "2024.01.09",
      views: 0,
      comments: 23,
      likes: 0,
      isNew: true,
    },
    {
      id: 4,
      title: "KH 개발자 인턴십 모집",
      company: "KH 정보교육원 종로",
      category: "서울특별시",
      field: "career · education",
      date: "2024.01.09",
      views: 0,
      comments: 23,
      likes: 0,
      isNew: true,
    },
    {
      id: 5,
      title: "KH 개발자 인턴십 모집",
      company: "KH 정보교육원 종로",
      category: "서울특별시",
      field: "career · education",
      date: "2024.01.09",
      views: 0,
      comments: 23,
      likes: 0,
      isNew: true,
    },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-content">
      <h1 className="page-title">지원한 공고</h1>

      <div className="filter-section">
        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="">지역 ▼</option>
            <option value="seoul">서울</option>
            <option value="busan">부산</option>
            <option value="daegu">대구</option>
          </select>

          <select
            className="filter-select"
            value={filters.field}
            onChange={(e) => handleFilterChange("field", e.target.value)}
          >
            <option value="">직종 ▼</option>
            <option value="developer">개발자</option>
            <option value="designer">디자이너</option>
            <option value="planner">기획자</option>
          </select>

          <select
            className="filter-select"
            value={filters.experience}
            onChange={(e) => handleFilterChange("experience", e.target.value)}
          >
            <option value="">기업형태 ▼</option>
            <option value="startup">스타트업</option>
            <option value="midsize">중견기업</option>
            <option value="large">대기업</option>
          </select>

          <select
            className="filter-select"
            value={filters.education}
            onChange={(e) => handleFilterChange("education", e.target.value)}
          >
            <option value="">고용형태 ▼</option>
            <option value="fulltime">정규직</option>
            <option value="contract">계약직</option>
            <option value="intern">인턴</option>
          </select>
        </div>

        <button className="search-btn">검색하기</button>
      </div>

      <div className="recruit-grid">
        {recruitData.map((item) => (
          <RecruitItem key={item.id} data={item} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RecruitList;
