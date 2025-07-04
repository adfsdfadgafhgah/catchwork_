import React, { useState } from "react";
import axios from "axios";
import "./ReportModalPage.css";

// 카테고리 이름 -> 코드 매핑
const categoryCodeMap = {
  "욕설/비방": 1,
  "성희롱/혐오": 2,
  "스팸/광고": 3,
  "사기/허위": 4,
  "정치/종교적 선동": 5,
  "기타": 6,
};

const ReportModalPage = ({ target, onClose, memNo }) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!category || !content) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken"); 
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/reportmodal",
        {
          reportTargetNo: target,                      // 신고 대상 번호
          reportTargetType: "MEMBER",                  //  회원 신고
          reportCategoryCode: categoryCodeMap[category], // 카테고리 코드
          reportContent: content,
          memNo: memNo,                                // 로그인한 사용자 번호
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,        
          },
        }
      );

      alert("신고가 성공적으로 접수되었습니다.");
      onClose();
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고 중 오류가 발생했습니다.");
    }
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
          <label>신고 카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
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
