import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

import logo from "../../assets/logo.png";

import styles from "./Header.module.css";
import HeaderNav from "./HeaderNav";
import { axiosApi } from "../../api/axiosAPI";

const Header = () => {
  const { memType, memNickname, memNo, signOut } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [memName, setMemName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // 모바일 메뉴 토글 상태

  const navigate = useNavigate();
  const location = useLocation();
  // const path = location.pathname;

  // 최초 마운트 시, 콘솔창 clear
  // useEffect(() => {
  //   console.clear();
  // }, []);

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

  // 모바일 메뉴 닫기 (네비게이션 이동 시)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isMobile = window.innerWidth <= 768;

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
        {/* 햄버거 버튼: 모바일에서만 보임, 오른쪽 끝 */}
        <button
          className={styles.hamburger}
          aria-label="메뉴 열기"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          type="button"
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>
        {/* 데스크탑: 검색창, userInfo 보임 */}
        {!isMobile && !isAuthPage && !isCorpUser && (
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
        {!isMobile && !isAuthPage && (
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
      {/* 모바일: HeaderNav가 userInfo, 검색창, nav 모두 포함 */}
      {isMobile && mobileMenuOpen && !isAuthPage && (
        <HeaderNav
          isMobile={true}
          mobileMenuOpen={true}
          setMobileMenuOpen={setMobileMenuOpen}
          memType={memType}
          memNickname={memNickname}
          memName={memName}
          handleSignOut={handleSignOut}
          navigate={navigate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          isCorpUser={isCorpUser}
        />
      )}
      {/* 데스크탑: nav 항상 보임 */}
      {!isMobile && !isAuthPage && (
        <HeaderNav
          isMobile={false}
          mobileMenuOpen={false}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
    </header>
  );
};

export default Header;
