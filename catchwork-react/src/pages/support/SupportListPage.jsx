import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 추가
import "./SupportListPage.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination"; // 페이지네이션 컴포넌트

const SupportListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [supportItems, setSupportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10; // 페이지당 항목 수

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/support/list");
        setSupportItems(response.data); // 응답 데이터 설정
      } catch (err) {
        setError(err.response?.data?.message || err.message || "데이터를 가져오는 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchSupportData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = supportItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(supportItems.length / itemsPerPage);

  const goToWrite = () => {
    navigate("/writesupport");
  };

  const goToDetail = (supportNo) => {
    navigate(`/supportdetail/${supportNo}`);
  };

  return (
    <div className="support-list-container">
      <div className="support-header">
        <h2>문의 목록</h2>
        <button className="button-common" onClick={goToWrite}>
          ✏️ 작성하기
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
                    <td>{item.supportNo}</td>
                    <td>{item.supportCategoryName}</td>
                    <td
                      className="title"
                      onClick={() => goToDetail(item.supportNo)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.supportTitle}
                    </td>
                    <td>{item.supportDate || "-"}</td>
                    <td
                      className={
                        item.supportStatus === "Y"
                          ? "status-done"
                          : "status-pending"
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
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SupportListPage;
