import React, { useState } from "react";
import styles from "./SideBar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/favicon.png";

const SideBar = () => {
  // 주소값
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 열린 메뉴
  const [expandedMenu, setExpandedMenu] = useState({
    fav: false,
    myContents: false,
    account: false,
  });

  // 사이드바 세부 목록 토글
  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // 페이지 상단으로 이동
  const handleMoveToTop = () => {
    window.scrollTo({ top: 0 });
  };

  // 사이드바 열기/닫기
  const handleOpenSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isSidebarOpen) {
    return (
      <div className={`${styles.sidebar} ${styles.isClose}`}>
        <div className={styles.sidebarContent}>
          <button onClick={handleOpenSidebar} className={styles.toggleButton}>
            <i className="material-icons">keyboard_arrow_down</i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.sidebar} ${styles.isOpen}`}>
      <div className={styles.sidebarContent}>
        <img
          src={logo}
          alt="logo"
          className={styles.logo}
          style={{ width: "100%", height: "200px", objectFit: "contain" }}
        />
        <button onClick={handleOpenSidebar} className={styles.toggleButton}>
          <i className="material-icons">menu</i>
        </button>
        <h2 className={styles.sidebarTitle}>마이 페이지</h2>

        <nav className={styles.sidebarNav}>
          <NavLink
            onClick={handleMoveToTop}
            to="/mypage/home"
            className={`${styles.navItem} ${
              location.pathname === "/mypage/home" ||
              location.pathname === "/mypage"
                ? styles.active
                : ""
            }`}
          >
            내정보
          </NavLink>

          <NavLink
            onClick={handleMoveToTop}
            to="/mypage/myrecruit"
            className={`${styles.navItem} ${
              location.pathname === "/mypage/myrecruit" ? styles.active : ""
            }`}
          >
            지원한 공고
          </NavLink>

          {/* 관심 목록 */}
          <div>
            <button
              onClick={() => toggleMenu("fav")}
              className={`${styles.navItem} ${styles.navItemExpandable}`}
            >
              <span>관심 목록</span>
              <i
                className={`material-icons ${
                  expandedMenu.fav ? styles.rotate90 : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.fav && (
              <div className={styles.subNav}>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/favrecruit"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/favrecruit"
                >
                  관심 공고
                </NavLink>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/favcompany"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/favcompany"
                >
                  관심 기업
                </NavLink>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/favboard"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/favboard"
                >
                  관심 게시글
                </NavLink>
              </div>
            )}
          </div>

          {/* 내가 쓴 목록 */}
          <div>
            <button
              onClick={() => toggleMenu("myContents")}
              className={`${styles.navItem} ${styles.navItemExpandable}`}
            >
              <span>내가 쓴 목록</span>
              <i
                className={`material-icons ${
                  expandedMenu.myContents ? styles.rotate90 : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.myContents && (
              <div className={styles.subNav}>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/myboard" ? styles.active : ""
                  }`}
                  to="/mypage/myboard"
                >
                  내가 쓴 게시글
                </NavLink>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/mycomment"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/mycomment"
                >
                  내가 쓴 댓글
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            onClick={handleMoveToTop}
            to="/mypage/membership"
            className={`${styles.navItem} ${
              location.pathname === "/mypage/membership" ? styles.active : ""
            }`}
          >
            멤버쉽
          </NavLink>

          {/* 계정 관리 */}
          <div>
            <button
              onClick={() => toggleMenu("account")}
              className={`${styles.navItem} ${styles.navItemExpandable}`}
            >
              <span>계정관리</span>
              <i
                className={`material-icons ${
                  expandedMenu.account ? styles.rotate90 : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.account && (
              <div className={styles.subNav}>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/editmyinfo"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/editmyinfo"
                >
                  내 정보 변경
                </NavLink>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/changepw"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/changepw"
                >
                  비밀번호 변경
                </NavLink>
                <NavLink
                  onClick={handleMoveToTop}
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/withdraw"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/withdraw"
                >
                  회원 탈퇴
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
