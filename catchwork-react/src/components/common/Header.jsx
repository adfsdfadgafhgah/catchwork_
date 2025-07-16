import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

import logo from "../../assets/logo.png";

import styles from "./Header.module.css";
import HeaderNav from "./HeaderNav";
import { axiosApi } from "../../api/axiosAPI";

const Header = () => {
  const { memType, memNickname, memNo, signin, signOut } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [memName, setMemName] = useState("");

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
        // navigate(
        //   `/search?type=company&query=${encodeURIComponent(searchTerm.trim())}`
        // );//company page로 바로 이동
        navigate(`/search?query=${searchTerm.trim()}`);
      }
    }
  };

  const handleSignOut = () => {
    signOut(); // zustand 초기화
    localStorage.removeItem("accessToken");

    navigate("/");
  };

  useEffect(() => {
    if (memNo != null) {
      axiosApi
        .get("/auth/corpmem/name", { params: { memNo } })
        .then((res) => setMemName(res.data));
    }
  }, [memNo, memName]);

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        {/* 로고 */}
        <div className={styles.logo}>
          {memType !== null ? (
            <>
              {memType === 1 ? (
                <Link to="/corprecruit">
                  <img src={logo} height="50px" alt="logo" />
                </Link>
              ) : (
                <Link to="/">
                  <img src={logo} height="50px" alt="logo" />
                </Link>
              )}
            </>
          ) : (
            <Link to="/">
              <img src={logo} height="50px" alt="logo" />
            </Link>
          )}
        </div>

        {/* 검색창: 로그인/회원가입/기업회원 페이지에서는 미노출 */}
        {!isAuthPage && !isCorpUser && (
          <div className={styles.searchBox}>
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            ></i>
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
          <div className={styles.userInfo}>
            {memType !== null ? (
              <>
                {memType === 1 ? (
                  <button onClick={() => navigate("/corpmypage")}>
                    {memName} 님
                  </button>
                ) : (
                  <button onClick={() => navigate("/mypage")}>
                    {memNickname} 님
                  </button>
                )}
                <button onClick={handleSignOut}>로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/signin">로그인</Link>
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
