import React, { useState } from "react";
import styles from "./SideBar.module.css";
import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
  // 주소값
  const location = useLocation();

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

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>마이 페이지</h2>

        <nav className={styles.sidebarNav}>
          <NavLink
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
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/favboard"
                      ? styles.active
                      : ""
                  }`}
                  to="/mypage/favboard"
                >
                  관심 후기
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
                  className={`${styles.subNavItem} ${
                    location.pathname === "/mypage/myboard" ? styles.active : ""
                  }`}
                  to="/mypage/myboard"
                >
                  내가 쓴 게시글
                </NavLink>
                <NavLink
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
