import React from "react";
import "./WriteSupportPage.css";

export default function WriteSupportPage({ logo }) {
  return (
    <div className="write-support-container">
     
      {/* Main */}
      <main className="main">
        <h2 className="page-title">문의 작성</h2>
          <div className="title-underline" />

        <div className="form-group">
          <input type="text" id="title" placeholder="제목"/>
        </div>

        <div className="form-group">
          <label htmlFor="category">문의 카테고리</label>
          <select id="category">
            <option>계정 관련 문의</option>
            <option>결제/환불 문의</option>
            <option>서비스 이용 문의</option>
            <option>정지 문의</option>
            <option>의의제기 문의</option>
            <option>기타 문의</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea id="content" placeholder="내용을 입력하세요."/>
        </div>

        <div className="button-group">
          <button className="cancel">✕ 취소하기</button>
          <button className="submit">✏️ 작성하기</button>
        </div>
      </main>
    </div>
  );
}