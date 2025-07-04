import React, { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import "./ReportModalPage.css";

const categoryCodeMap = {
  "욕설/비방": 1,
  "성희롱/혐오": 2,
  "스팸/광고": 3,
  "사기/허위": 4,
  "정치/종교적 선동": 5,
  "기타": 6,
};

const ReportModalPage = ({ targetNo, onClose }) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!category || !content) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    if (!targetNo || typeof targetNo !== "string") {
      alert("신고 대상이 올바르지 않습니다.");
      return;
    }

    try {
      const postData = {
        reportTargetNo: targetNo,         // 문자열 회원번호
        reportTargetType: "MEMBER",       // 고정
        reportCategoryCode: categoryCodeMap[category],
        reportContent: content,
      };

      console.log("신고 전송 데이터:", postData);

      await axiosApi.post("/reportmodal", postData);

      alert("신고가 성공적으로 접수되었습니다.");
      onClose();
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고 중 오류가 발생했습니다.");
    }
  };

  console.log("target : ", targetNo);

  return (
    <div className="modal-overlay">
      <div className="report-modal-box">
        <h2 className="modal-title">신고하기</h2>
        <div className="title-underline" />

        <div className="form-group">
          <label>신고 대상</label>
          <div className="readonly-display">{targetNo}</div>
        </div>

        <div className="form-group">
          <label>신고 카테고리</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>신고 사유를 선택해주세요</option>
            <option>욕설/비방</option>
            <option>성희롱/혐오</option>
            <option>스팸/광고</option>
            <option>사기/허위</option>
            <option>정치/종교적 선동</option>
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
          <button className="button-common cancel-button" onClick={onClose}>
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
