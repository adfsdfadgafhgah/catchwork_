import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import RecruitList from "../../components/recruit/RecruitList";
import styles from "./CorpRecruitListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate, useOutletContext } from "react-router-dom";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import InfiniteScroll from "react-infinite-scroll-component";

export default function CorpRecruitListPage() {
  const [recruits, setRecruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { memNo, memType } = useOutletContext();
  // 정렬, 상태, 작성자 필터
  const [statusFilter, setStatusFilter] = useState("all"); // 전체, 모집중, 마감됨
  const [sortOrder, setSortOrder] = useState("latest"); // 최신순, 오래된순, 조회수순, 좋아요순
  const [writerFilter, setWriterFilter] = useState("all"); // 전체, 내가쓴공고

  const [corpNo, setCorpNo] = useState();
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 실제 검색에 쓸 값
  const [corpMemRoleCheck, setCorpMemRoleCheck] = useState("N"); // 'Y'면 대표이사

  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부 확인
  const [page, setPage] = useState(1); // 페이지 번호

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

  // #region ===== 필터 옵션 데이터 정의 (새로 추가) =====
  const filterOptions = {
    statusFilter: [
      { value: "all", label: "전체 상태" },
      { value: "open", label: "채용중" },
      { value: "closed", label: "마감됨" },
    ],
    sortOrder: [
      { value: "latest", label: "최신순" },
      { value: "oldest", label: "오래된순" },
      { value: "views", label: "조회수순" },
      { value: "likes", label: "좋아요순" },
    ],
    writerFilter: [
      { value: "all", label: "전체 공고" },
      { value: "me", label: "내가 쓴 공고" },
    ],
  };
  // #endregion

  // 로그인 정보 세팅
  useEffect(() => {
    if (memNo === undefined || memType === undefined) {
      return;
    }

    const fetchCorpNo = async () => {
      // 비로그인 상태 (memNo가 null)이거나 일반회원 (memType이 1이 아님)인 경우
      // corpNo를 null로 설정하고 역할 체크도 N으로 유지하며 API 호출하지 않음
      if (!memNo || memType !== 1) {
        setCorpNo(null);
        setCorpMemRoleCheck("N");
        // 이 경우, 기업회원 관련 정보 로딩은 완료된 것으로 간주
        // 채용공고 목록 로딩은 fetchRecruitList에서 처리
        return;
      }

      // 로그인했고 기업회원 (memType === 1)인 경우에만 corpNo 조회 시도
      try {
        const resp = await axiosApi.get("/corpcompany/corpNo", {
          params: { memNo: memNo },
        });
        if (resp.status === 200) {
          const { corpNo: fetchedCorpNo, corpMemRoleCheck: fetchedRoleCheck } =
            resp.data;
          setCorpNo(fetchedCorpNo);
          setCorpMemRoleCheck(fetchedRoleCheck);
        }
      } catch (err) {
        console.error("corpNo 조회 실패:", err);
        setCorpNo(null); // 실패 시 corpNo 초기화
        setCorpMemRoleCheck("N");
      }
    };

    fetchCorpNo();
  }, [memNo, memType]);

  // 공고 목록 불러오기 (정렬 + 검색)
  const fetchRecruitList = async (pageNum = 1, isNewSearch = false) => {
    if (!memNo || memType !== 1 || !corpNo) {
      setIsLoading(false);
      setRecruits([]);
      return;
    }

    // 기업회원이지만 corpNo가 없는 경우 (회사 정보 미등록)
    if (memType === 1 && !corpNo) {
      setIsLoading(false);
      setRecruits([]);
      return;
    }

    // 새로운 검색일 경우에만 전체 페이지 로딩 상태를 활성화합니다.
    if (isNewSearch) {
      setIsLoading(true);
    }

    try {
      const pageSize = 9; // 한 페이지에 불러올 공고 수
      const resp = await axiosApi.get("/corpRecruit/list", {
        params: {
          sort: sortOrder,
          status: statusFilter,
          writer: writerFilter,
          query: confirmedSearchTerm,
          memNo: memNo,
          corpNo: corpNo,
          page: pageNum, // 페이지 번호 파라미터
          size: pageSize, // 페이지 크기 파라미터
        },
      });

      if (resp.status === 200) {
        let list = resp.data;

        // "마감됨" 필터 클라이언트 측 필터링 (기존 로직 유지)
        if (statusFilter === "closed") {
          const now = new Date();
          list = list.filter((recruit) => {
            const endDate = new Date(`${recruit.recruitEndDate}T23:59:59`);
            return (
              recruit.recruitStatus === 3 ||
              (recruit.recruitStatus === 0 && endDate < now)
            );
          });
        }

        // 데이터를 덮어쓰거나 추가하도록 변경
        setRecruits(isNewSearch ? list : (prev) => [...prev, ...list]);
        // 불러온 데이터가 페이지 크기보다 작으면 더 이상 데이터가 없는 것으로 간주
        setHasMore(list.length === pageSize);
      }
    } catch (err) {
      console.error("채용공고 목록 조회 실패:", err);
    } finally {
      // 새로운 검색일 경우에만 전체 페이지 로딩 상태를 비활성화합니다.
      // 이 로직은 기존과 동일하지만, 위의 setIsLoading(true)가 조건부로 바뀌면서 함께 올바르게 동작하게 됩니다.
      if (isNewSearch) {
        setIsLoading(false);
      }
    }
  };

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecruitList(nextPage, false);
  };

  // 공고 목록 불러오기 (필터링, 정렬)
  useEffect(() => {
    if (
      memNo === undefined ||
      memType === undefined ||
      (memType === 1 && corpNo === null)
    ) {
      return;
    }

    // 필터 변경 시 상태 초기화
    setRecruits([]);
    setPage(1);
    setHasMore(true);
    fetchRecruitList(1, true); // isNewSearch를 true로 하여 새롭게 검색
  }, [
    sortOrder,
    statusFilter,
    writerFilter,
    corpNo,
    confirmedSearchTerm,
    memNo,
    memType,
  ]);

  // 핸들러 함수
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setConfirmedSearchTerm(searchTerm.trim());
    }
  };

  const handleSearchClick = () => {
    setConfirmedSearchTerm(searchTerm.trim());
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSortOrder("latest");
    setWriterFilter("all");
    setSearchTerm("");
    setConfirmedSearchTerm("");
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}), // 모든 필터를 닫고
      [filterName]: !prev[filterName], // 현재 클릭한 것만 토글
    }));
  };

  const toggleAllFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (sortOrder !== "latest") count++;
    if (writerFilter !== "all") count++;
    return count;
  };

  const getFilterButtonText = (filterName, currentValue) => {
    const option = filterOptions[filterName].find(
      (opt) => opt.value === currentValue
    );
    return option ? option.label : "";
  };
  // #endregion

  // 공고 작성하기 버튼
  const handleWrite = () => {
    if (!memNo) {
      alert("로그인 후 이용해주세요.");
      navigate("/signin");
      return;
    }
    if (memType !== 1) {
      // 일반 회원
      alert("기업회원만 공고 작성이 가능합니다.");
      return;
    }
    if (!corpNo) {
      // 기업회원이지만 corpNo 없음 (회사 정보 미등록)
      alert("회사 정보 등록 후 공고 작성이 가능합니다.");
      return;
    }
    if (corpMemRoleCheck === "Y") {
      alert("대표이사 계정은 공고 작성이 불가능합니다.");
      return;
    }
    navigate("/corpRecruit/write");
  };

  // #region ===== 필터 섹션 렌더링 함수 (새로 추가) =====
  const renderFilterSection = (filterName, currentValue, onChange) => (
    <div className={styles.filterSection}>
      <button
        className={`${styles.filterToggle} ${
          (filterName === "sortOrder" && currentValue !== "latest") ||
          (filterName !== "sortOrder" && currentValue !== "all")
            ? styles.active
            : ""
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
          {filterOptions[filterName].map((option) => (
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
  // #endregion

  // 로딩 UI
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>채용공고를 불러오는 중...</span>
      </div>
    );
  }

  // 기업회원이 아닌 경우의 UI
  if (memType !== 1) {
    return (
      <div className={styles.recruitListPage}>
        <SectionHeader title="채용공고" />
        <div className={styles.noResult}>
          <i className="fa-solid fa-circle-info"></i>
          <p>기업회원만 이용할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  // 기업회원이지만 회사 정보가 없는 경우
  if (memType === 1 && !corpNo) {
    return (
      <div className={styles.recruitListPage}>
        <SectionHeader title="채용공고" />
        <div className={styles.noResult}>
          <i className="fa-solid fa-building-circle-exclamation"></i>
          <p>회사 정보 등록 후 채용공고 관리가 가능합니다.</p>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/corp/company/write")}
          >
            회사 정보 등록하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recruitListPage}>
      <SectionHeader title="채용공고" />

      {/* 검색 및 필터 컨트롤 영역 */}
      <div className={styles.controlSection}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="공고 제목, 내용 등으로 검색"
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
            {renderFilterSection("statusFilter", statusFilter, setStatusFilter)}
            {renderFilterSection("sortOrder", sortOrder, setSortOrder)}
            {renderFilterSection("writerFilter", writerFilter, setWriterFilter)}
          </div>
        </div>
      )}

      {/* 활성 필터 표시 */}
      {getActiveFilterCount() > 0 && (
        <div className={styles.activeFilters}>
          <div className={styles.activeFiltersContent}>
            <span className={styles.activeFiltersLabel}>적용된 필터:</span>
            <div className={styles.activeFilterTags}>
              {statusFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  {getFilterButtonText("statusFilter", statusFilter)}
                  <button onClick={() => setStatusFilter("all")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {sortOrder !== "latest" && (
                <span className={styles.activeFilterTag}>
                  {getFilterButtonText("sortOrder", sortOrder)}
                  <button onClick={() => setSortOrder("latest")}>
                    <i className="fa-solid fa-times"></i>
                  </button>
                </span>
              )}
              {writerFilter !== "all" && (
                <span className={styles.activeFilterTag}>
                  {getFilterButtonText("writerFilter", writerFilter)}
                  <button onClick={() => setWriterFilter("all")}>
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
            <div className={styles.spinner}></div>
            <span>더 많은 공고를 불러오는 중...</span>
          </div>
        }
        endMessage={
          recruits.length > 0 ? (
            <div className={styles.noResult}>
              <i className="fa-solid fa-inbox"></i>
              <p>더 이상 채용공고가 없습니다.</p>
            </div>
          ) : null // 처음부터 결과가 없으면 아무것도 표시 안함
        }
      >
        {/* RecruitList를 InfiniteScroll의 자식으로 렌더링 */}
        <RecruitList
          recruits={recruits}
          memNo={memNo}
          corpNo={corpNo}
          memType={memType}
        />
      </InfiniteScroll>

      {/* [추가] 처음부터 검색 결과가 없는 경우 메시지 표시 */}
      {!isLoading && recruits.length === 0 && (
        <div className={styles.noResult}>
          <i className="fa-solid fa-inbox"></i>
          <p>조건에 맞는 채용공고가 없습니다.</p>
        </div>
      )}

      {/* 공고 작성 버튼 */}
      {memNo && memType === 1 && corpMemRoleCheck !== "Y" && (
        <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
      )}
      <ScrollToTopButton />
    </div>
  );
}
