
// CorpConfirmEditPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import "./CorpConfirmEditPage.css";

const CorpConfirmEditPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
      navigate("/corpeditmyinfo"); // 페이지 이동
    }
  };

  return (
    <div className="corp-page-container">
      <CorpSideBar />

      <div className="corp-edit-content">
        <div className="form-container">
          <h2 className="page-title">기업 회원 정보 수정</h2>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorpConfirmEditPage;