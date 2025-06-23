import React from "react";
import "./SupportListPage.css";
import { useNavigate } from "react-router-dom";

const dummyData = [
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
       <div className="title-underline"/>

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
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.category}</td>
              <td className="title" onClick={() => goToDetail(item.id)}>{item.title}</td>
              <td>{item.date}</td>
              <td className={item.status === "답변 완료" ? "status-done" : "status-pending"}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span className="arrow">«</span>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <span className="page-number" key={n}>
            {n}
          </span>
        ))}
        <span className="arrow">»</span>
      </div>
    </div>
  );
};

export default SupportListPage;
