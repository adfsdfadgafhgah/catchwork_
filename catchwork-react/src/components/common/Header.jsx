import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import logo from "../../assets/logo.png";

import "./Header.css";
import HeaderNav from "./HeaderNav";

const Header = () => {
  const [user, setUser] = useState(null); // 로그인 정보
  const [searchTerm, setSearchTerm] = useState(""); // 검색어

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage =
    path === "/signin" ||
    path === "/signup" ||
    path === "/corpsignin" ||
    path === "/corpsignup";

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim() !== "") {
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const logout = () => {
    // 로그아웃 처리 로직
    setUser(null);
    navigate("/");
  };

  const isCorpUser = user?.type === "corporate"; // 기업회원 여부 (예시)
  // const isCorpUser = user?.memType === 1; // 기업회원 여부 (0: 개인회원, 1: 기업회원)

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
            <button onClick={handleSearch}>검색</button>
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
            {user ? (
              <>
                <span>{user.nickname} 님</span>
                <button onClick={logout}>로그아웃</button>
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

      {/* 네비게이션 메뉴 */}
      {!isAuthPage && <HeaderNav />}
    </header>
  );
};

export default Header;
