import React, { useState } from "react";
import "./SupportListPage.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination"; // Pagination 컴포넌트 임포트
 
// 가데이터 
const dummyData = [
  { id: 20, category: "카테고리", title: "ㅋㅋ", date: "2025-08-09", status: "답변 완료" },
  { id: 19, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 완료" },
  { id: 18, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 17, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 16, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 15, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 14, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 13, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 12, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 11, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 10, category: "카테고리", title: "ㅋㅋ", date: "2025-08-09", status: "답변 완료" },
  { id: 9, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 완료" },
  { id: 8, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 7, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 6, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 5, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 4, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 3, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 2, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  { id: 1, category: "카테고리", title: "제목", date: "2025-08-09", status: "답변 대기" },
  
];

const SupportListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 10개 항목 (CorpCvListPage와 동일)

  // 페이지네이션 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const goToWrite = () => {
    navigate("/writesupport");
  };

  const goToDetail = (id) => {
    navigate(`/supportdetail/${id}`);
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
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.category}</td>
              <td className="title" onClick={() => goToDetail(item.id)}>
                {item.title}
              </td>
              <td>{item.date}</td>
              <td className={item.status === "답변 완료" ? "status-done" : "status-pending"}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
};

export default SupportListPage;