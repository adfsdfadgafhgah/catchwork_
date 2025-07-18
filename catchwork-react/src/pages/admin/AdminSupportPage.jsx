import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import Pagination from "../../components/common/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AdminSupportPage.module.css";

export default function AdminSupportPage() {
  const navigate = useNavigate();
  const [supportItems, setSupportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // 날짜 포맷팅 헬퍼 함수 (yyyy-mm-dd 형식)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 필터 및 정렬 상태
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'completed'
  const [sortOrder, setSortOrder] = useState("latest"); // 'latest', 'oldest'
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 입력 상태
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 실제 검색에 사용될 확정된 검색어

  // 모든 문의 내역 데이터 로드 (의존성 배열에서 navigate 제거)
  useEffect(() => {
    // 추가: URL 파라미터를 읽어 필터 상태를 설정합니다.
    // 이렇게 하면 페이지를 새로고침해도 필터 값이 유지됩니다.
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const statusFromUrl = searchParams.get("status") || "all";
    const sortFromUrl = searchParams.get("sort") || "latest";
    const queryFromUrl = searchParams.get("query") || "";

    setCurrentPage(pageFromUrl);
    setFilterStatus(statusFromUrl);
    setSortOrder(sortFromUrl);
    setSearchTerm(queryFromUrl);

    fetchSupportData(pageFromUrl, statusFromUrl, sortFromUrl, queryFromUrl);
  }, [searchParams]); // URL 파라미터가 변경될 때마다 이 효과를 실행

  const fetchSupportData = async (page, status, sort, query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosApi.get("/admin/supportlist", {
        params: { status, sort, query },
      });

      setSupportItems(response.data);
    } catch (err) {
      console.error("문의 내역 불러오기 실패:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "데이터를 가져오는 중 오류 발생"
      );
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = supportItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(supportItems.length / itemsPerPage);

  // 페이지를 변경할 때 URL의 'page' 파라미터도 함께 업데이트합니다.
  const handlePageChange = (page) => {
    setCurrentPage(page); // 현재 페이지 상태 업데이트
    // URL 파라미터를 업데이트합니다. 기존 필터, 정렬, 검색 값은 유지합니다.
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  // 수정: 필터, 정렬, 검색 시 페이지를 1로 초기화하고 URL도 업데이트하도록 변경
  const applyFilters = () => {
    searchParams.set("status", filterStatus);
    searchParams.set("sort", sortOrder);
    searchParams.set("query", searchTerm);
    searchParams.set("page", "1"); // 검색 시 1페이지로 초기화
    setSearchParams(searchParams);
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

  const goToDetail = (supportNo) => {
    navigate(`/admin/support/${supportNo}`); // 관리자용 상세 페이지 경로로 이동
  };

  if (loading) {
    return <p className={styles.loadingMessage}>로딩 중...</p>;
  }

  return (
    <div className={styles.adminSupportListContainer}>
      <h1 className={styles.pageTitle}>문의 목록</h1>

      {/* 필터 및 검색 UI */}
      <div className={styles.controlsSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="filterStatus">상태:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              // 수정: 값이 바뀔 때마다 바로 URL 업데이트
              searchParams.set("status", e.target.value);
              searchParams.set("page", "1");
              setSearchParams(searchParams);
            }}
          >
            <option value="all">전체</option>
            <option value="pending">답변 대기</option>
            <option value="completed">답변 완료</option>
          </select>
        </div>

        <div className={styles.sortGroup}>
          <label htmlFor="sortOrder">정렬:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              // 수정: 값이 바뀔 때마다 바로 URL 업데이트
              searchParams.set("sort", e.target.value);
              searchParams.set("page", "1");
              setSearchParams(searchParams);
            }}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>

        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="문의 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // 수정: 검색 실행 함수 호출
                applyFilters();
              }
            }}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.searchButton} onClick={handleSearch}>
            검색
          </button>
          <button className={styles.resetButton} onClick={handleReset}>
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>

      {error ? (
        <p className={styles.errorMessage}>오류: {error}</p>
      ) : (
        <>
          <table className={styles.supportTable}>
            <thead>
              <tr>
                <th>번호</th>
                <th>카테고리</th>
                <th>작성자</th>
                <th>제목</th>
                <th>작성일</th>
                <th>답변 여부</th>
                <th>답변 관리자</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.supportNo}>
                    <td>{item.supportNo}</td>
                    <td>{item.supportCategoryName}</td>
                    {/* memNickname 또는 corpName은 서버 응답에 포함되어야 함 */}
                    <td>{item.memNickname || item.memName || "알 수 없음"}</td>
                    <td
                      className={styles.title}
                      onClick={() => goToDetail(item.supportNo)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.supportTitle}
                    </td>
                    <td>{formatDate(item.supportDate)}</td>
                    <td
                      className={
                        item.supportStatus === "Y"
                          ? styles.statusDone
                          : styles.statusPending
                      }
                    >
                      {item.supportStatus === "Y" ? "답변 완료" : "답변 대기"}
                    </td>
                    {/* item.answerAdminNickname 또는 item.answerAdminName은 서버 응답에 포함되어야 함 */}
                    <td>
                      {item.supportStatus === "Y"
                        ? item.adminNickname || "알 수 없음"
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noItems}>
                    작성된 문의가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
