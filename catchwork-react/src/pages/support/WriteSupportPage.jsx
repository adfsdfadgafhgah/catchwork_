import React from "react";
import "../../components/css/WriteSupportPage.css";

export default function WriteSupportPage({ logo }) {
  return (
    <div className="write-support-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Catch Work Logo" />
          <span className="logo-text">Catch Work</span>
        </div>
        <div className="search-box">
          <input type="text" placeholder="직종명 입력이나, 취준진단" />
          <button>🔍</button>
        </div>
        <div className="user-info">
          <span>오우무무무무으으으로음</span>
          <button className="logout">로그아웃</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <a href="#">채용공고</a>
        <a href="#">기업정보</a>
        <a href="#">취준진단</a>
        <a href="#">내 이력서</a>
      </nav>

      {/* Main */}
      <main className="main">
        <h2 className="page-title">문의 작성</h2>

        <div className="form-group">
          <input type="text" id="title" placeholder="제목" />
        </div>

        <div className="form-group">
          <label htmlFor="category">문의 카테고리</label>
          <select id="category">
            <option>서비스 이용 문의</option>
            <option>결제/환불 문의</option>
            <option>기술적 문제</option>
            <option>기타 문의</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea id="content" placeholder="내용을 입력하세요." />
        </div>

        <div className="button-group">
          <button className="cancel">✕ 취소하기</button>
          <button className="submit">✏️ 작성하기</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <a href="#">개인정보처리방침</a>
        <a href="#">이용약관</a>
        <span>Copyright © CATCH. All rights reserved.</span>
        <a href="#" className="highlight">
          문의하기
        </a>
        <a href="#">기업채용</a>
      </footer>
    </div>
  );
}