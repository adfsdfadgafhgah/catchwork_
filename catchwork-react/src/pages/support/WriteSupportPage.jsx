import React, { useState } from "react";
import "./WriteSupportPage.css";

export default function WriteSupportPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("계정 관련 문의");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/support/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supportTitle: title,
          supportCategory: category,
          supportContent: content,
          memNo: 100, // 필요에 따라 로그인한 사용자 정보 사용
        }),
      });

      if (response.ok) {
        alert("문의가 성공적으로 등록되었습니다.");
        // 예: navigate("/support"); 등으로 이동 가능
      } else {
        alert("등록 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="write-support-container">
      <main className="main">
        <h2 className="page-title">문의 작성</h2>

        <div className="form-group">
          <input
            type="text"
            id="title"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">문의 카테고리</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
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
          <textarea
            id="content"
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button
            className="button-common cancel-button"
            onClick={() => window.history.back()}
          >
            ✕ 취소하기
          </button>
          <button className="button-common submit-button" onClick={handleSubmit}>
            ✏️ 작성하기
          </button>
        </div>
      </main>
    </div>
  );
}
