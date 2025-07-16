import React, { useState, useEffect } from "react";
import "./SupportListPage.css";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import Pagination from "../../components/common/Pagination";
import { axiosApi } from "../../api/axiosAPI";

const SupportListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); 

  const [supportItems, setSupportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const initialPage = parseInt(searchParams.get("page")) || 1; // URL에서 page 파라미터 읽기
  const [currentPage, setCurrentPage] = useState(initialPage); // 초기값 적용

  useEffect(() => {
    setSearchParams({ page: currentPage }); // 페이지 이동 시 URL 갱신
  }, [currentPage, setSearchParams]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인을 먼저 해주세요!");
      navigate("/signin");
      return;
    }

    const fetchSupportData = async () => {
      try {
        const response = await axiosApi.get("http://localhost:8080/support/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSupportItems(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "데이터를 가져오는 중 오류 발생"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupportData();
  }, [navigate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = supportItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(supportItems.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  const goToWrite = () => {
    navigate("/writesupport");
  };

  const goToDetail = (supportNo) => {
    navigate(`/supportdetail/${supportNo}?page=${currentPage}`); // 현재 페이지 번호 전달
  };

  return (
    <div className="support-list-container">
      <div className="support-header">
        <h2>문의 목록</h2>
        <button className="write-btn-submit" onClick={goToWrite}>
          <i className="fa-regular fa-pen-to-square"></i> 작성하기
        </button>
      </div>
      <div className="title-underline" />

      {loading ? (
        <p className="loading-message">로딩 중...</p>
      ) : error ? (
        <p className="error-message">오류: {error}</p>
      ) : (
        <>
          <table className="support-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성일</th>
                <th>답변 여부</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.supportNo}>
                    <td>{item.seqNo}</td>
                    <td>{item.supportCategoryName}</td>
                    <td
                      className="title"
                      onClick={() => goToDetail(item.supportNo)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.supportTitle}
                    </td>
                    <td>{formatDate(item.supportDate)}</td>
                    <td
                      className={
                        item.supportStatus === "Y" ? "status-done" : "status-pending"
                      }
                    >
                      {item.supportStatus === "Y" ? "답변 완료" : "답변 대기"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-items">
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
              onPageChange={(page) => setCurrentPage(page)} // 현재 페이지 유지
            />
          )}
        </>
      )}
    </div>
  );
};

export default SupportListPage;
