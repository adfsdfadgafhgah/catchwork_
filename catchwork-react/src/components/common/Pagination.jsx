import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const pageLimit = 5; // 한 번에 보여줄 페이지 번호 개수
    let startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    let endPage = startPage + pageLimit - 1;

    // 끝 페이지 보정
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pageLimit + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-number ${currentPage === i ? "active" : ""}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-nav first"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        &lt;&lt;
      </button>

      <button
        className="page-nav prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      <div className="page-numbers">{renderPageNumbers()}</div>

      <button
        className="page-nav next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>

      <button
        className="page-nav last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;
