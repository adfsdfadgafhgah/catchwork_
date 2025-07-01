import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import "./CorpChangePwPage.css";

const CorpChangePasswordPage = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    alert("비밀번호가 성공적으로 변경되었습니다.");
    navigate("/corpmypage");
  };

  return (
    <div className="corp-page-container">
      <CorpSideBar />
      <div className="main-content">
        <div className="content-container">
          <h2 className="page-title">기업 회원 비밀번호 변경</h2>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPw" className="form-label">기존 비밀번호</label>
              <input
                type="password"
                id="currentPw"
                className="form-input"
                placeholder="비밀번호를 입력해주세요"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPw" className="form-label">새 비밀번호</label>
              <input
                type="password"
                id="newPw"
                className="form-input"
                placeholder="비밀번호를 입력해주세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPw"
                className="form-input"
                placeholder="비밀번호를 확인해주세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="button-container">
              <button type="submit" className="submit-btn">수정하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CorpChangePasswordPage;
