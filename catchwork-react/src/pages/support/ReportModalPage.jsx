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

const ReportModalPage = ({
  targetNo,
  targetType,
  onClose,
  memberNo,
  targetNickname,
}) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // 표시할 신고 대상명 (닉네임 또는 fallback)
  const displayTargetName =
    targetNickname && targetNickname.trim() !== ""
      ? targetNickname
      : "알 수 없는 대상";

  const handleSubmit = async () => {
    if (!category || !content) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    if (!targetNo) {
      alert("신고 대상이 올바르지 않습니다.");
      return;
    }

    if (!targetNickname || targetNickname.trim() === "") {
      // 선택 사항: 신고 제출 시 닉네임이 없으면 사용자에게 알림
      // alert("신고 대상 이름이 없습니다. 다시 시도해주세요.");
      // return;
      // 닉네임 없어도 진행하고 싶으면 이 부분은 주석 처리 가능
    }

    try {
      const postData = {
        reportTargetNo: String(targetNo), // 숫자든 문자든 문자열로 변환
        reportTargetType: targetType.toUpperCase(), // "COMMENT", "REPLY", "BOARD", "MEMBER", "CORPORATE"
        reportCategoryCode: categoryCodeMap[category],
        reportContent: content,
        memNo: memberNo,
      };

      await axiosApi.post("/reportmodal", postData);

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
          <div className="readonly-display">{displayTargetName}</div>
        </div>

        <div className="form-group">
          <label>신고 카테고리</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>
              신고 사유를 선택해주세요
            </option>
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
