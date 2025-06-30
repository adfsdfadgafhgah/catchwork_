import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

import logo from "../../assets/logo.png";

import "./Header.css";
import HeaderNav from "./HeaderNav";

const Header = () => {
  const { memType, memNickname, role, signin, signOut } = useAuthStore(); // zustand 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [result, setResult] = useState(""); // 상태 메시지

  const navigate = useNavigate();
  const location = useLocation();
  // const path = location.pathname;

  const isAuthPage = [
    "/signin",
    "/signup",
    "/corpsignin",
    "/corpsignup",
    "/findid",
    "/findpw",
  ].includes(location.pathname);
  const isCorpUser = memType === 1;

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim() !== "") {
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  // 개인 회원 임시 로그인
  // 개인 회원 임시 로그인
  // 개인 회원 임시 로그인
  // 개인 회원 임시 로그인
  // 개인 회원 임시 로그인
  const handleSignin = async () => {
    const { success, message } = await signin("Test_229", "Test");
    setResult(message);
  };
  // 기업 회원 임시 로그인
  // 기업 회원 임시 로그인
  // 기업 회원 임시 로그인
  // 기업 회원 임시 로그인
  // 기업 회원 임시 로그인
  const handleCorpSignin = async () => {
    const { success, message } = await signin("Test_146", "Test");
    setResult(message);
  };

  const handleSignOut = () => {
    signOut(); // zustand 초기화
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* 로고 */}
        <div className="logo">
          <Link to="/">
            <img src={logo} height="50px" alt="logo" />
          </Link>
        </div>

        {/* 검색창: 로그인/회원가입/기업회원 페이지에서는 미노출 */}
        {!isAuthPage && !isCorpUser && (
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="진중한 취업이야기, 취준진담"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        )}

        {/* 사용자 정보 영역 */}
        {!isAuthPage && (
          <div className="user-info">
            {memType !== null ? (
              <>
                <span>{memNickname} 님</span>
                <button onClick={handleSignOut}>로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/signin">로그인</Link>
                &nbsp;|&nbsp;
                <Link to="/signup">회원가입</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* 임시 로그인 버튼 (개인/기업) */}
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <button onClick={handleSignin}>개인 로그인</button>
        <button onClick={handleCorpSignin}>기업 로그인</button>
      </div>
      {/* 네비게이션 메뉴 */}
      {!isAuthPage && <HeaderNav />}
    </header>
  );
};

export default Header;
