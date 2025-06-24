import React, { useState } from "react";
import SideBar from "../../components/myPage/CorpSideBar";
import "./CorpChangePwPage.css";

const CorpChangePwPage = () => {
  const [activeTab, setActiveTab] = useState("비밀번호 변경");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!currentPassword.trim()) {
      setPasswordError("기존 비밀번호를 입력해주세요");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("새 비밀번호를 입력해주세요");
      return;
    }

    if (!confirmPassword.trim()) {
      setPasswordError("비밀번호 확인을 입력해주세요");
      return;
    }

    // 비밀번호 확인 검증
    if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다");
      return;
    }

    // 기존 비밀번호와 새 비밀번호 동일성 검사
    if (currentPassword === newPassword) {
      setPasswordError("기존 비밀번호와 새 비밀번호가 동일합니다");
      return;
    }

    setPasswordError("");
    alert("비밀번호가 성공적으로 변경되었습니다.");

    // 폼 초기화
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="corp-page-container">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="corp-edit-content">
        <div className="form-container">
          <h2 className="page-title">기업 회원 비밀번호 변경</h2>
          <div className="form-group">
            <label>기존 비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호를 확인해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorpChangePwPage;