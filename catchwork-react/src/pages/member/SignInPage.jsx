// SignInPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icon.png";
import "./SignInPage.css";
import { axiosApi } from "../../api/axiosAPI";

const SignInPage = () => {
  const [isCorp, setIsCorp] = useState(false); // false: 개인, true: 기업
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axiosApi.post("/signin", {
        memId,
        memPw,
      });

      const accessToken = res.headers.authorization?.split(" ")[1];
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);

        const decoded = getDecodedToken(accessToken);
        const memType = decoded?.memType;

        // memType 분기: 0 - 개인, 1 - 기업
        if (memType === 0) {
          navigate("/");
        } else if (memType === 1) {
          navigate("/corp");
        } else {
          alert("알 수 없는 사용자 유형입니다.");
        }
      }
    } catch (err) {
      alert("로그인 실패: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-image-box">
        <img src={icon} />
        <button
          className="signup-button"
          onClick={() =>
            navigate("/signup?type=" + (isCorp ? "corporate" : "personal"))
          }
        >
          {isCorp ? "기업 회원 가입" : "개인 회원 가입"}
        </button>
      </div>

      <div className="signin-form-box">
        <div className="tab-buttons">
          <button
            className={!isCorp ? "active" : ""}
            onClick={() => setIsCorp(false)}
          >
            개인 회원
          </button>
          <button
            className={isCorp ? "active" : ""}
            onClick={() => setIsCorp(true)}
          >
            기업 회원
          </button>
        </div>

        <div className="input-group">
          <input type="text" placeholder="아이디를 입력해주세요" />
          <input type="password" placeholder="비밀번호를 입력해주세요" />
        </div>

        <div className="remember-me">
          <input type="radio" id="rememberId" />
          <label htmlFor="rememberId">아이디 저장</label>
        </div>

        <button className="signin-button">로그인하기</button>

        <div className="links">
          <span onClick={() => navigate("/findid")}>아이디 찾기</span>
          <span onClick={() => navigate("/findpw")}>비밀번호 찾기</span>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
