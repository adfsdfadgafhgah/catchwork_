import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import "./CorpConfirmEditPage.css";

const CorpConfirmEditPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    // 비밀번호가 일치하면 페이지 이동
    setError("");
    navigate("/corpeditmyinfo");
  };

  return (
    <div className="corp-page-container">
      <CorpSideBar />
      <div className="corp-edit-content">
        <div className="form-container">
          <h2 className="page-title">기업 회원 정보 수정</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="form-input"
                required
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="button-container">
              <button
                type="submit"
                className="submit-btn"
              >
                수정하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CorpConfirmEditPage;