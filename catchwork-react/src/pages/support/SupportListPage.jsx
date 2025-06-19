import React, { useState } from 'react';
import './SupportList.css';

const SupportList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // 샘플 데이터
  const supportData = [
    { id: 10, category: '카테고리', title: '제목', status: '답변 완료', date: '2025-06-09' },
    { id: 9, category: '카테고리', title: '제목', status: '답변 완료', date: '2025-06-09' },
    { id: 8, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 7, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 6, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 5, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 4, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 3, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 2, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' },
    { id: 1, category: '카테고리', title: '제목', status: '답변 대기', date: '2025-06-09' }
  ];

  const totalPages = 10;
  const pagesPerGroup = 10;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleWriteInquiry = () => {
    // 문의 작성 페이지로 이동
    console.log('문의 작성 페이지로 이동');
  };

  return (
    <div className="support-list-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">Catch Work</span>
          </div>
        </div>
        
        <div className="search-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="직종명 찾기아니지, 취준진단"
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
        </div>

        <div className="user-section">
          <span className="user-info">오늘도무무무으으으로음</span>
          <button className="logout-btn">로그아웃</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <a href="#" className="nav-item">채용공고</a>
        <a href="#" className="nav-item">기업정보</a>
        <a href="#" className="nav-item">취준진단</a>
        <a href="#" className="nav-item">내 이력서</a>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h1 className="page-title">문의 목록</h1>
          <button className="write-button" onClick={handleWriteInquiry}>
            ✏️ 작성하기
          </button>
        </div>
        
        <div className="support-table-container">
          <table className="support-table">
            <thead>
              <tr>
                <th className="col-number">번호</th>
                <th className="col-category">카테고리</th>
                <th className="col-title">제목</th>
                <th className="col-status">작성일</th>
                <th className="col-date">답변 여부</th>
              </tr>
            </thead>
            <tbody>
              {supportData.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="col-number">{item.id}</td>
                  <td className="col-category">{item.category}</td>
                  <td className="col-title">{item.title}</td>
                  <td className="col-status">{item.date}</td>
                  <td className="col-date">
                    <span className={`status-badge ${item.status === '답변 완료' ? 'completed' : 'pending'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
          >
            ≪
          </button>
          <button 
            className="pagination-btn"
            onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="pagination-btn"
            onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button 
            className="pagination-btn"
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
          >
            ≫
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <span>Copyright © CATCH. All rights reserved.</span>
          <a href="#" className="footer-highlight">문의하기</a>
          <a href="#">기업채용</a>
        </div>
      </footer>
    </div>
  );
};

export default SupportList;