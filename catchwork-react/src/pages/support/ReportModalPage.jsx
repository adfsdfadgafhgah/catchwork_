import React from "react";
import "./ReportModalPage.css";

const ReportModalPage = ({ target, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="report-modal-box">
        <h2 className="modal-title">신고하기</h2>
        <div className="title-underline" />

        {/* 신고 대상 (읽기 전용 텍스트) */}
        <div className="form-group">
          <label>신고 대상</label>
          <div className="readonly-display">{target}</div>
        </div>

        <div className="form-group">
          <select defaultValue="">
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
          <textarea placeholder="내용을 입력하세요." />
        </div>

        <div className="button-group">
          <button className="button-common cancel-button" onClick={onClose}>
            ✕ 취소하기
          </button>
          <button className="button-common submit-button">🚨 신고하기</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModalPage;
