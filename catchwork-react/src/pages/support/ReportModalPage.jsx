import React, { useState } from "react";
import axios from "axios";
import "./ReportModalPage.css";

const ReportModalPage = ({ target, onClose }) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!category || !content) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/reportmodal", {
        reportTarget: target,
        reportCategory: category,
        reportContent: content,
        memNo: 100, // 실제 로그인된 사용자 번호로 대체 필요
      });

      alert("신고되었습니다.");
      onClose();
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    alert("취소되었습니다");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="report-modal-box">
        <h2 className="modal-title">신고하기</h2>
        <div className="title-underline" />

        <div className="form-group">
          <label>신고 대상</label>
          <div className="readonly-display">{target}</div>
        </div>

        <div className="form-group">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>
              신고 카테고리
            </option>
            <option>욕설</option>
            <option>도배</option>
            <option>부적절한 콘텐츠</option>
            <option>기타</option>
          </select>
        </div>

        <div className="form-group">
          <textarea
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="button-common cancel-button" onClick={handleCancel}>
            <span className="material-symbols-outlined">close</span> 취소하기
          </button>
          <button className="button-common submit-button" onClick={handleSubmit}>
            <span className="material-symbols-outlined">siren</span> 신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModalPage;
