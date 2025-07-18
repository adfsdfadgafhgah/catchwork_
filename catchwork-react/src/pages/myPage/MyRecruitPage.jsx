import MemberRecruitList from "../../components/recruit/MemberRecruitList";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import styles from "../major/MemberRecruitListPage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

function MyRecruitPage() {
  const { memNo } = useOutletContext();
  const [recruits, setRecruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 실제 검색에 쓸 값

  // 직무, 근무지역, 경력, 학력, 기업형태, 고용형태 필터
  const [recruitJobNameFilter, setRecruitJobNameFilter] = useState("all"); // 직무
  const [recruitJobAreaFilter, setRecruitJobAreaFilter] = useState("all"); // 근무지역
  const [recruitCareerFilter, setRecruitCareerFilter] = useState("all"); // 경력
  const [recruitEduFilter, setRecruitEduFilter] = useState("all"); // 학력
  const [corpTypeFilter, setCorpTypeFilter] = useState("all"); // 기업형태
  const [recruitTypeFilter, setRecruitTypeFilter] = useState("all"); // 고용형태

  // 필터 펼침/접힘 상태 관리
  const [expandedFilters, setExpandedFilters] = useState({
    recruitJobName: false,
    recruitJobArea: false,
    recruitCareer: false,
    recruitEdu: false,
    corpType: false,
    recruitType: false,
  });

  // 전체 필터 펼침/접힘 상태
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부 확인

  // 필터 옵션 데이터
  const filterOptions = {
    recruitJobName: [
      { value: "all", label: "전체" },
      { value: "기획·전략", label: "기획·전략" },
      { value: "법무·사무·총무", label: "법무·사무·총무" },
      { value: "인사·HR", label: "인사·HR" },
      { value: "회계·세무", label: "회계·세무" },
      { value: "마케팅·광고·MD", label: "마케팅·광고·MD" },
      { value: "AI·개발·데이터", label: "AI·개발·데이터" },
      { value: "디자인", label: "디자인" },
      { value: "물류·무역", label: "물류·무역" },
      { value: "운전·배송·배송", label: "운전·배송·배송" },
      { value: "영업", label: "영업" },
      { value: "고객상담·TM", label: "고객상담·TM" },
      { value: "금융·보험", label: "금융·보험" },
      { value: "식·음료", label: "식·음료" },
      { value: "건축·시설", label: "건축·시설" },
      { value: "고객서비스·리테일", label: "고객서비스·리테일" },
      { value: "엔지니어링·설계", label: "엔지니어링·설계" },
      { value: "제조·생산", label: "제조·생산" },
      { value: "교육", label: "교육" },
      { value: "의료·바이오", label: "의료·바이오" },
      { value: "미디어·문화·스포츠", label: "미디어·문화·스포츠" },
      { value: "공공·복지", label: "공공·복지" },
      { value: "기타", label: "기타" },
    ],
    recruitJobArea: [
      { value: "all", label: "전체" },
      { value: "서울", label: "서울" },
      { value: "부산", label: "부산" },
      { value: "대구", label: "대구" },
      { value: "인천", label: "인천" },
      { value: "광주", label: "광주" },
      { value: "대전", label: "대전" },
      { value: "울산", label: "울산" },
      { value: "세종", label: "세종" },
      { value: "경기", label: "경기" },
      { value: "강원", label: "강원" },
      { value: "충북", label: "충북" },
      { value: "충남", label: "충남" },
      { value: "전북", label: "전북" },
      { value: "전남", label: "전남" },
      { value: "경북", label: "경북" },
      { value: "경남", label: "경남" },
      { value: "제주", label: "제주" },
      { value: "기타", label: "기타" },
    ],
    recruitCareer: [
      { value: "all", label: "전체" },
      { value: "신입", label: "신입" },
      { value: "1~3년", label: "1~3년" },
      { value: "4~6년", label: "4~6년" },
      { value: "7~9년", label: "7~9년" },
      { value: "10~15년", label: "10~15년" },
      { value: "16~20년", label: "16~20년" },
      { value: "21년 이상", label: "21년 이상" },
      { value: "경력무관", label: "경력무관" },
    ],
    recruitEdu: [
      { value: "all", label: "전체" },
      { value: "고졸", label: "고졸" },
      { value: "전문학사", label: "전문학사" },
      { value: "학사", label: "학사" },
      { value: "석사", label: "석사" },
      { value: "박사", label: "박사" },
      { value: "학력무관", label: "학력무관" },
    ],
    corpType: [
      { value: "all", label: "전체" },
      { value: "대기업", label: "대기업" },
      { value: "중견기업", label: "중견기업" },
      { value: "중소기업", label: "중소기업" },
      { value: "공기업", label: "공기업" },
      { value: "스타트업", label: "스타트업" },
      { value: "외국계기업", label: "외국계기업" },
      { value: "기타", label: "기타" },
    ],
    recruitType: [
      { value: "all", label: "전체" },
      { value: "정규직", label: "정규직" },
      { value: "계약직", label: "계약직" },
      { value: "인턴", label: "인턴" },
      { value: "일용직", label: "일용직" },
      { value: "프리랜서", label: "프리랜서" },
      { value: "파견직", label: "파견직" },
      { value: "기타", label: "기타" },
    ],
  };

  // 공고 목록 불러오기 (정렬 + 검색)
  const fetchRecruitList = async (pageNum = 1, isNewSearch = false) => {
    const params = {
      recruitJobName: recruitJobNameFilter,
      recruitJobArea: recruitJobAreaFilter,
      recruitCareer: recruitCareerFilter,
      recruitEdu: recruitEduFilter,
      corpType: corpTypeFilter,
      recruitType: recruitTypeFilter,
      query: searchTerm,
      memNo: memNo,
      page: pageNum,
      size: 9,
    };

    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/myPage/myRecruitList", { params });

      if (resp.status === 200) {
        const list = resp.data;
        if (isNewSearch) {
          setRecruits(list);
        } else {
          setRecruits((prev) => [...prev, ...list]);
        }
        setHasMore(list.length === 9);
      }
    } catch (err) {
      console.error("채용공고 목록 조회 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecruitList(nextPage);
  };

  // 공고 목록 불러오기 (정렬 + 검색)
  useEffect(() => {
    if (memNo === undefined) return;
    setRecruits([]);
    setPage(1);
    setHasMore(true);
    fetchRecruitList(1, true);
  }, [
    recruitJobNameFilter,
    recruitJobAreaFilter,
    recruitCareerFilter,
    recruitEduFilter,
    corpTypeFilter,
    recruitTypeFilter,
    confirmedSearchTerm,
    memNo,
  ]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setConfirmedSearchTerm(searchTerm.trim());
    }
  };

  const handleSearchClick = () => {
    setConfirmedSearchTerm(searchTerm.trim());
  };

  const handleResetFilters = () => {
    setRecruitJobNameFilter("all");
    setRecruitJobAreaFilter("all");
    setRecruitCareerFilter("all");
    setRecruitEduFilter("all");
    setCorpTypeFilter("all");
    setRecruitTypeFilter("all");
    setSearchTerm("");
    setConfirmedSearchTerm("");
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const toggleAllFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (recruitJobNameFilter !== "all") count++;
    if (recruitJobAreaFilter !== "all") count++;
    if (recruitCareerFilter !== "all") count++;
    if (recruitEduFilter !== "all") count++;
    if (corpTypeFilter !== "all") count++;
    if (recruitTypeFilter !== "all") count++;
    return count;
  };

  const getFilterButtonText = (filterName, currentValue) => {
    const filterLabels = {
      recruitJobName: "직무",
      recruitJobArea: "근무지역",
      recruitCareer: "경력",
      recruitEdu: "학력",
      corpType: "기업형태",
      recruitType: "고용형태",
    };

    if (currentValue === "all") {
      return filterLabels[filterName];
    }

    const option = filterOptions[filterName].find(
      (opt) => opt.value === currentValue
    );
    return option ? option.label : filterLabels[filterName];
  };

  const renderFilterSection = (
    filterName,
    title,
    options,
    currentValue,
    onChange
  ) => (
    <div className={styles.filterSection}>
      <button
        className={`${styles.filterToggle} ${
          currentValue !== "all" ? styles.active : ""
        }`}
        onClick={() => toggleFilter(filterName)}
      >
        <span className={styles.filterLabel}>
          {getFilterButtonText(filterName, currentValue)}
        </span>
        <i
          className={`fa-solid fa-chevron-down ${styles.chevron} ${
            expandedFilters[filterName] ? styles.expanded : ""
          }`}
        ></i>
      </button>

      {expandedFilters[filterName] && (
        <div className={styles.filterOptions}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`${styles.filterOption} ${
                currentValue === option.value ? styles.active : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setExpandedFilters((prev) => ({
                  ...prev,
                  [filterName]: false,
                }));
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading && recruits.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>채용공고를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div
      className={styles.recruitListPage}
      style={{ width: "100%", margin: "0  auto" }}
    >
      <SectionHeader title="채용공고" />
      {/* 검색 및 필터 컨트롤 영역 */}
      <div className={styles.controlSection}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="채용공고를 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button className={styles.searchButton} onClick={handleSearchClick}>
              검색
            </button>
          </div>
        </div>

        <div className={styles.filterControls}>
          <button
            className={`${styles.filterToggleAll} ${
              isFiltersExpanded ? styles.active : ""
            }`}
            onClick={toggleAllFilters}
          >
            <i className="fa-solid fa-filter"></i>
            상세 필터
            {getActiveFilterCount() > 0 && (
              <span className={styles.filterCount}>
                {getActiveFilterCount()}
              </span>
            )}
            <i
              className={`fa-solid fa-chevron-down ${styles.chevron} ${
                isFiltersExpanded ? styles.expanded : ""
              }`}
            ></i>
          </button>

          <button className={styles.resetButton} onClick={handleResetFilters}>
            <i className="fa-solid fa-rotate-right"></i>
            초기화
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      {isFiltersExpanded && (
        <div className={styles.filterContainer}>
          <div className={styles.filterGrid}>
            {renderFilterSection(
              "recruitJobName",
              "직무",
              filterOptions.recruitJobName,
              recruitJobNameFilter,
              setRecruitJobNameFilter
            )}
            {renderFilterSection(
              "recruitJobArea",
              "근무지역",
              filterOptions.recruitJobArea,
              recruitJobAreaFilter,
              setRecruitJobAreaFilter
            )}
            {renderFilterSection(
              "recruitCareer",
              "경력",
              filterOptions.recruitCareer,
              recruitCareerFilter,
              setRecruitCareerFilter
            )}
            {renderFilterSection(
              "recruitEdu",
              "학력",
              filterOptions.recruitEdu,
              recruitEduFilter,
              setRecruitEduFilter
            )}
            {renderFilterSection(
              "corpType",
              "기업형태",
              filterOptions.corpType,
              corpTypeFilter,
              setCorpTypeFilter
            )}
            {renderFilterSection(
              "recruitType",
              "고용형태",
              filterOptions.recruitType,
              recruitTypeFilter,
              setRecruitTypeFilter
            )}
          </div>
        </div>
      )}

      {/* 활성 필터 표시 */}
      {getActiveFilterCount() > 0 && (
        <div className={styles.activeFilters}>
          <div className={styles.activeFiltersContent}>
            <span className={styles.activeFiltersLabel}>적용된 필터:</span>
            <div className={styles.activeFilterTags}>
              {recruitJobNameFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  직무:{" "}
                  {getFilterButtonText("recruitJobName", recruitJobNameFilter)}
                  <button onClick={() => setRecruitJobNameFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitJobAreaFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  근무지역:{" "}
                  {getFilterButtonText("recruitJobArea", recruitJobAreaFilter)}
                  <button onClick={() => setRecruitJobAreaFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitCareerFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  경력:{" "}
                  {getFilterButtonText("recruitCareer", recruitCareerFilter)}
                  <button onClick={() => setRecruitCareerFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitEduFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  학력: {getFilterButtonText("recruitEdu", recruitEduFilter)}
                  <button onClick={() => setRecruitEduFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {corpTypeFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  기업형태: {getFilterButtonText("corpType", corpTypeFilter)}
                  <button onClick={() => setCorpTypeFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitTypeFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  고용형태:{" "}
                  {getFilterButtonText("recruitType", recruitTypeFilter)}
                  <button onClick={() => setRecruitTypeFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 결과 영역 */}
      <InfiniteScroll
        dataLength={recruits.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className={styles.loadingMore}>
            더 많은 공고를 불러오는 중...
          </div>
        }
        endMessage={
          <div className={styles.noResult}>
            <i className="fa-solid fa-inbox"></i>
            <p>더 이상 채용공고가 없습니다.</p>
          </div>
        }
      >
        <MemberRecruitList recruits={recruits} memNo={memNo} />
      </InfiniteScroll>

      <ScrollToTopButton />
    </div>
  );
}

export default MyRecruitPage;
