import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import styles from "./AdminSupportPage.module.css";

export default function AdminSupportPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [supportItems, setSupportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

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

  // 모든 문의 내역 데이터 로드
  useEffect(() => {
    fetchSupportData();
  }, [navigate, filterStatus, sortOrder, confirmedSearchTerm]); // 필터, 정렬, 검색어 변경 시 재요청

  const fetchSupportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosApi.get("/admin/supportlist", {
        params: {
          status: filterStatus, // 답변 상태 필터
          sort: sortOrder, // 정렬 순서
          query: confirmedSearchTerm, // 검색어
        },
      });
      // ERD에 따르면 supportItems의 각 item에 memNickname 또는 corpName이 포함되어야 작성자 표시 가능
      // 또한, 답변 관리자를 표시하려면 item에 answerAdminNickname 또는 answerAdminName 필드가 포함되어야 함
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

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 페이지 1로 초기화
    setConfirmedSearchTerm(searchTerm); // 검색어 확정
  };

  const goToDetail = (supportNo) => {
    navigate(`/admin/support/${supportNo}`); // 관리자용 상세 페이지 경로로 이동
  };

  if (loading) {
    return <p className={styles.loadingMessage}>로딩 중...</p>;
  }

  return (
    <div className={styles.adminSupportListContainer}>
      <h1 className={styles.pageTitle}>모든 회원의 문의 목록</h1>

      {/* 필터 및 검색 UI */}
      <div className={styles.controlsSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="filterStatus">상태:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>

        <div className={styles.searchGroup}>
          <input
            type="text"
            placeholder="제목 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>검색</button>
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
                        ? item.answerAdminNickname || "알 수 없음"
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
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
}
