import React, { useState } from "react";
import SideBar from "../../components/myPage/CorpSideBar"; // 경로 확인하세요
import "./CorpConfirmEditPage.css";

const CorpConfirmEditPage = ({ onSuccess, onCancel }) => {
  const [activeTab, setActiveTab] = React.useState("비밀번호 확인");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
    } else if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
    } else {
      setError("");
      onSuccess();
    }
  };

  return (
    <div className="mypage-container">
      {/* 좌측 사이드바 */}
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 우측 메인 컨텐츠 */}
      <div className="main-content">
        <div className="content-container">
          <h2 className="content-title">기업 회원 정보 수정</h2>
          <div className="confirm-edit-container">
            <div className="confirm-edit-box">
              <form onSubmit={handleSubmit} className="confirm-edit-form">
                <div className="form-group">
                  <label className="form-label">비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">비밀번호 확인</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="form-input"
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                <div className="button-group">
                  <button type="submit" className="confirm-button">
                    확인
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

export default CorpConfirmEditPage;