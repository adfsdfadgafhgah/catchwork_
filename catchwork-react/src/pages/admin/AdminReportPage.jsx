import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import Pagination from "../../components/common/Pagination";
import styles from "./AdminReportPage.module.css";

export default function AdminReportPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 목록 및 상태 관리
  const [groupedReports, setGroupedReports] = useState([]);
  const [totalGroupedCount, setTotalGroupedCount] = useState(0);
  const [summary, setSummary] = useState({
    totalReports: 0,
    unprocessedCount: 0,
    uniqueTargets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 필터링 및 검색 상태
  const [filters, setFilters] = useState({
    targetType: "",
    status: "",
    startDate: "",
    endDate: "",
    query: "",
  });

  // 데이터 로딩 useEffect
  useEffect(() => {
    // URL 파라미터로 상태 복원 및 초기화
    const page = parseInt(searchParams.get("page") || "1", 10);
    const targetType = searchParams.get("targetType") || "";
    const status = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const query = searchParams.get("query") || "";

    setCurrentPage(page);
    setFilters({ targetType, status, startDate, endDate, query });

    fetchGroupedReportsAndSummary({
      page,
      targetType,
      status,
      startDate,
      endDate,
      query,
    });
  }, [searchParams]);

  // 데이터 로딩 함수
  const fetchGroupedReportsAndSummary = async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      // API 호출 시 필터 객체를 params로 전달
      const listResponse = await axiosApi.get("/admin/report/group", {
        params: currentFilters,
      });
      const summaryResponse = await axiosApi.get("/admin/report/summary", {
        params: currentFilters,
      });

      setGroupedReports(listResponse.data.list);
      setTotalGroupedCount(listResponse.data.totalCount);
      setSummary(summaryResponse.data);
    } catch (err) {
      console.error("신고 내역 또는 요약 정보 불러오기 실패:", err);
      setError(err.message || "데이터를 가져오는 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // // 신고 처리 API를 호출하는 핸들러 함수
  // const handleProcessReport = async (reportNo, e) => {
  //   e.stopPropagation(); // 행 클릭 이벤트(상세 페이지 이동)가 함께 실행되는 것을 방지

  //   if (!window.confirm(`신고 번호 ${reportNo}번을 처리하시겠습니까?`)) {
  //     return;
  //   }

  //   try {
  //     const response = await axiosApi.put("/admin/report/process", {
  //       reportNo,
  //     });
  //     alert(response.data); // 성공 메시지 출력

  //     // 중요: 처리 후 목록을 새로고침하여 변경된 상태를 즉시 반영
  //     fetchReportsAndSummary(filters);
  //   } catch (err) {
  //     console.error("신고 처리 실패:", err);
  //     alert(err.response?.data || "신고 처리 중 오류가 발생했습니다.");
  //   }
  // };

  // 필터 값 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 검색 및 필터 적용 핸들러
  const handleSearch = () => {
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      }
    });
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  // 필터 초기화 핸들러
  const handleReset = () => {
    setSearchParams({});
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  // 상세 페이지 이동
  const goToDetail = (reportTargetNo, reportTargetType) => {
    navigate(`/admin/report/target/${reportTargetType}/${reportTargetNo}`);
  };

  const totalPages = Math.ceil(totalGroupedCount / itemsPerPage);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>신고 목록</h1>

      {/* 필터링 섹션 */}
      <div className={styles.filterBox}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label>신고 대상</label>
            <select
              name="targetType"
              value={filters.targetType}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="BOARD">게시글</option>
              <option value="COMMENT">댓글</option>
              <option value="COMPANY">기업</option>
              <option value="RECRUIT">공고</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>처리 상태</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="N">미처리</option>
              <option value="Y">처리 완료</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>기간</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <span>~</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              name="query"
              placeholder="신고 대상의 내용, 닉네임 등으로 검색"
              value={filters.query}
              onChange={handleFilterChange}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.searchButton} onClick={handleSearch}>
              Search
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 요약 정보 섹션 */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <p>총 신고 대상</p>
          <span>{summary.uniqueTargets}</span>
        </div>
        <div className={styles.summaryCard}>
          <p>총 신고 건수</p>
          <span>{summary.totalReports}</span>
        </div>
        <div className={styles.summaryCard}>
          <p>미처리 건수</p>
          <span>{summary.unprocessedCount}</span>
        </div>
      </div>

      {/* 데이터 테이블 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className={styles.errorMessage}>오류: {error}</p>
      ) : (
        <>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>신고 대상 유형</th>
                <th>신고 대상 (내용)</th>
                <th>신고 건수</th>
                <th>최신 신고일</th>
                <th>처리 상태</th>
              </tr>
            </thead>
            <tbody>
              {groupedReports.length > 0 ? (
                groupedReports.map((group) => (
                  <tr
                    key={`${group.reportTargetType}-${group.reportTargetNo}`}
                    // ⬇️ 상세 페이지 이동 onClick 이벤트 추가
                    onClick={() =>
                      goToDetail(group.reportTargetNo, group.reportTargetType)
                    }
                    style={{ cursor: "pointer" }} // 클릭 가능함을 시각적으로 표시
                  >
                    <td>{group.reportTargetType}</td>
                    <td>{group.reportContent}</td>
                    <td>{group.reportCount}건</td>
                    <td>
                      {new Date(group.latestReportDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={
                          group.overallStatus === "N"
                            ? styles.statusPending
                            : styles.statusDone
                        }
                      >
                        {group.overallStatus === "N" ? "미처리" : "처리 완료"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">해당하는 신고 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
