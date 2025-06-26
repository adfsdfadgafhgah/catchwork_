import React from "react";
import "./ReportModalPage.css";

const ReportModalPage = ({ target, onClose }) => {
  const handleSubmit = () => {
    alert("신고되었습니다");
    onClose(); // 신고 후 모달 닫기
  };

  const handleCancel = () => {
    alert("취소되었습니다");
    onClose(); // 취소 후 모달 닫기
  };

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