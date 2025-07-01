import React, { useState } from "react";
import axios from "axios"; 
import "./WriteSupportPage.css";
import { useNavigate } from "react-router-dom";

export default function WriteSupportPage() {
  const navigate = useNavigate(); 

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("계정 관련 문의");
  const [content, setContent] = useState("");

  // 카테고리 문자열 → 숫자 코드 매핑 (서버에 맞게 조정하세요)
  const categoryCodeMap = {
    "계정 관련 문의": 1,
    "결제/환불 문의": 2,
    "서비스 이용 문의": 3,
    "정지 문의": 4,
    "의의제기 문의": 5,
    "기타 문의": 6,
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/support/write", {
        supportTitle: title,              // 서버에서 지원하지 않으면 제거 가능
        supportCategoryCode: categoryCodeMap[category],
        supportContent: content,
        memNo: 100,
      });

      alert("문의가 성공적으로 등록되었습니다.");
      navigate("/supportlist"); 
    } catch (error) {
      console.error("에러 발생:", error);
      if (error.response) {
        alert("등록 실패: " + (error.response.data?.message || "서버 오류가 발생했습니다."));
      } else {
        alert("서버와의 연결에 실패했습니다.");
      }
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
