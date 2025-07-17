import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import { Link } from "react-router-dom";
import CompanyItem from "../../components/company/CompanyItem";
import MemberRecruitList from "../../components/recruit/MemberRecruitList";
import useLoginMember from "../../stores/loginMember";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import "./SearchResultPage.css";

const SearchResultPage = () => {
  const { loginMember } = useLoginMember();
  const [params] = useSearchParams();
  const query = params.get("query")?.trim() || "";
  const type = params.get("type") || "recruit";

  const [companyResults, setCompanyResults] = useState([]);
  const [recruitResults, setRecruitResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedFilters, setExpandedFilters] = useState({
    recruitJobName: false,
    recruitJobArea: false,
    recruitCareer: false,
    recruitEdu: false,
    corpType: false,
    recruitType: false,
  });
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const [recruitJobName, setRecruitJobName] = useState("all");
  const [recruitCareer, setRecruitCareer] = useState("all");
  const [recruitEdu, setRecruitEdu] = useState("all");
  const [corpType, setCorpType] = useState("all");
  const [recruitType, setRecruitType] = useState("all");
  const [recruitJobArea, setRecruitJobArea] = useState("all");

  const filterOptions = {
    recruitJobName: [
      { label: "전체", value: "all" },
      { label: "기획·전략", value: "기획·전략" },
      { label: "AI·개발·데이터", value: "AI·개발·데이터" },
      { label: "디자인", value: "디자인" },
      { label: "기타", value: "기타" },
    ],
    recruitJobArea: [
      { label: "전체", value: "all" },
      { label: "서울", value: "서울" },
      { label: "경기", value: "경기" },
      { label: "기타", value: "기타" },
    ],
    recruitCareer: [
      { label: "전체", value: "all" },
      { label: "신입", value: "신입" },
      { label: "경력무관", value: "경력무관" },
    ],
    recruitEdu: [
      { label: "전체", value: "all" },
      { label: "고졸", value: "고졸" },
      { label: "학사", value: "학사" },
    ],
    corpType: [
      { label: "전체", value: "all" },
      { label: "대기업", value: "대기업" },
      { label: "스타트업", value: "스타트업" },
    ],
    recruitType: [
      { label: "전체", value: "all" },
      { label: "정규직", value: "정규직" },
      { label: "인턴", value: "인턴" },
    ],
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
    if (currentValue === "all") return filterLabels[filterName];
    const option = filterOptions[filterName].find(
      (opt) => opt.value === currentValue
    );
    return option ? option.label : filterLabels[filterName];
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (recruitJobName !== "all") count++;
    if (recruitJobArea !== "all") count++;
    if (recruitCareer !== "all") count++;
    if (recruitEdu !== "all") count++;
    if (corpType !== "all") count++;
    if (recruitType !== "all") count++;
    return count;
  };

  const renderFilterSection = (filterName, options, currentValue, onChange) => (
    <div className="filterSection">
      <button
        className={`filterToggle ${currentValue !== "all" ? "active" : ""}`}
        onClick={() =>
          setExpandedFilters((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
          }))
        }
      >
        <span className="filterLabel">
          {getFilterButtonText(filterName, currentValue)}
        </span>
        <i
          className={`fa-solid fa-chevron-down chevron ${
            expandedFilters[filterName] ? "expanded" : ""
          }`}
        />
      </button>
      {expandedFilters[filterName] && (
        <div className="filterOptions">
          {options.map((option) => (
            <button
              key={option.value}
              className={`filterOption ${
                currentValue === option.value ? "active" : ""
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

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const SearchData = async () => {
      try {
        if (type === "recruit") {
          const res = await axiosApi.get("/search/recruit", {
            params: {
              query,
              memNo: loginMember?.memNo || "",
              recruitJobName,
              recruitJobArea,
              recruitCareer,
              recruitEdu,
              corpType,
              recruitType,
            },
          });
          setRecruitResults(res.data || []);
        } else {
          const res = await axiosApi.get("/search/company", {
            params: {
              query,
              ...(loginMember?.memNo ? { memNo: loginMember.memNo } : {}),
            },
          });
          setCompanyResults(res.data || []);
        }
      } catch (err) {
        console.error("검색 실패", err);
      } finally {
        setLoading(false);
      }
    };
    SearchData();
  }, [
    query,
    type,
    loginMember?.memNo,
    recruitJobName,
    recruitJobArea,
    recruitCareer,
    recruitEdu,
    corpType,
    recruitType,
  ]);

  return (
    <main className="search-container">
      <div className="search-tabs">
        <Link
          className={type === "recruit" ? "active" : ""}
          to={`/search?query=${query}&type=recruit`}
        >
          채용공고
        </Link>
        <Link
          className={type === "company" ? "active" : ""}
          to={`/search?query=${query}&type=company`}
        >
          기업정보
        </Link>
      </div>

      {type === "recruit" && (
        <div className="filterControls">
          <button
            className={`filterToggleAll ${isFiltersExpanded ? "active" : ""}`}
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <i className="fa-solid fa-filter"></i>
            상세 필터
            {getActiveFilterCount() > 0 && (
              <span className="filterCount">{getActiveFilterCount()}</span>
            )}
            <i
              className={`fa-solid fa-chevron-down chevron ${
                isFiltersExpanded ? "expanded" : ""
              }`}
            />
          </button>
          {/* ✅ 초기화 버튼 추가 */}
          <button
            className="resetButton"
            onClick={() => {
              setRecruitJobName("all");
              setRecruitJobArea("all");
              setRecruitCareer("all");
              setRecruitEdu("all");
              setCorpType("all");
              setRecruitType("all");
            }}
          >
            <i className="fa-solid fa-rotate-right" />
            초기화
          </button>
        </div>
      )}

      {type === "recruit" && isFiltersExpanded && (
        <div className="filterContainer">
          <div className="filterGrid">
            {renderFilterSection(
              "recruitJobName",
              filterOptions.recruitJobName,
              recruitJobName,
              setRecruitJobName
            )}
            {renderFilterSection(
              "recruitJobArea",
              filterOptions.recruitJobArea,
              recruitJobArea,
              setRecruitJobArea
            )}
            {renderFilterSection(
              "recruitCareer",
              filterOptions.recruitCareer,
              recruitCareer,
              setRecruitCareer
            )}
            {renderFilterSection(
              "recruitEdu",
              filterOptions.recruitEdu,
              recruitEdu,
              setRecruitEdu
            )}
            {renderFilterSection(
              "corpType",
              filterOptions.corpType,
              corpType,
              setCorpType
            )}
            {renderFilterSection(
              "recruitType",
              filterOptions.recruitType,
              recruitType,
              setRecruitType
            )}
          </div>
        </div>
      )}
      {type === "recruit" && getActiveFilterCount() > 0 && (
        <div className="activeFilters">
          <div className="activeFiltersContent">
            <span className="activeFiltersLabel">적용된 필터:</span>
            <div className="activeFilterTags">
              {recruitJobName !== "all" && (
                <span className="activeFilterTag">
                  직무: {getFilterButtonText("recruitJobName", recruitJobName)}
                  <button onClick={() => setRecruitJobName("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitJobArea !== "all" && (
                <span className="activeFilterTag">
                  근무지역:{" "}
                  {getFilterButtonText("recruitJobArea", recruitJobArea)}
                  <button onClick={() => setRecruitJobArea("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitCareer !== "all" && (
                <span className="activeFilterTag">
                  경력: {getFilterButtonText("recruitCareer", recruitCareer)}
                  <button onClick={() => setRecruitCareer("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitEdu !== "all" && (
                <span className="activeFilterTag">
                  학력: {getFilterButtonText("recruitEdu", recruitEdu)}
                  <button onClick={() => setRecruitEdu("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {corpType !== "all" && (
                <span className="activeFilterTag">
                  기업형태: {getFilterButtonText("corpType", corpType)}
                  <button onClick={() => setCorpType("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {recruitType !== "all" && (
                <span className="activeFilterTag">
                  고용형태: {getFilterButtonText("recruitType", recruitType)}
                  <button onClick={() => setRecruitType("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <h2>"{query}" 검색 결과</h2>

      {loading ? (
        <p>로딩 중...</p>
      ) : type === "company" ? (
        companyResults.length > 0 ? (
          <div className="company-grid">
            {companyResults.map((c) => (
              <CompanyItem key={c.corpNo} company={c} />
            ))}
          </div>
        ) : (
          <p>해당하는 기업이 없습니다.</p>
        )
      ) : recruitResults.length > 0 ? (
        <MemberRecruitList
          recruits={recruitResults}
          loginMember={loginMember}
          className="recruit-card"
        />
      ) : (
        <p>해당하는 공고가 없습니다.</p>
      )}

      <ScrollToTopButton />
    </main>
  );
};

export default SearchResultPage;
