import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/myPage/CorpSideBar"; // 경로 맞게 수정하세요
import "./CorpChangePwPage.css";

const CorpChangePwPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("비밀번호 변경");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPw.length < 8) {
      setError("새 비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    console.log("비밀번호 변경 요청:", { currentPw, newPw });
    setError("");
    alert("비밀번호가 성공적으로 변경되었습니다.");
    navigate("/corpdashboard");
  };

  return (
    <div className="mypage-container">
      {/* 좌측 사이드바 */}
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 우측 메인 컨텐츠 */}
      <div className="main-content">
        <div className="content-container">
          <h2 className="content-title">비밀번호 변경</h2>
          <div className="confirm-edit-container">
            <div className="confirm-edit-box">
              <form onSubmit={handleSubmit} className="confirm-edit-form">
                <div className="form-group">
                  <label htmlFor="currentPw" className="form-label">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    id="currentPw"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="현재 비밀번호를 입력해주세요"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPw" className="form-label">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    id="newPw"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="새 비밀번호를 입력해주세요"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPw" className="form-label">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    id="confirmPw"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="새 비밀번호를 다시 입력해주세요"
                    className="form-input"
                    required
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                <div className="button-group">
                  <button type="submit" className="confirm-button">
                    변경하기
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="cancel-button"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpChangePwPage;