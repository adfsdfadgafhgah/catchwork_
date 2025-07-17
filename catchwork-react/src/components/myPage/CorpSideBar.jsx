import React, { useState } from "react";
import styles from "./CorpSideBar.module.css"; // 모듈 CSS
import { NavLink, useLocation } from "react-router-dom";

const CorpSideBar = () => {
  const location = useLocation();

  const [expandedMenu, setExpandedMenu] = useState({
    account: false,
  });

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
            to="/corpmypage/home"
            className={`${styles.navItem} ${
              location.pathname === "/corpmypage/home" ||
              location.pathname === "/corpmypage"
                ? styles.active
                : ""
            }`}
          >
            내정보
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
                  to="/corpmypage/editmyinfo"
                  className={`${styles.subNavItem} ${
                    location.pathname === "/corpmypage/editmyinfo"
                      ? styles.active
                      : ""
                  }`}
                >
                  내 정보 변경
                </NavLink>
                <NavLink
                  to="/corpmypage/changepw"
                  className={`${styles.subNavItem} ${
                    location.pathname === "/corpmypage/changepw"
                      ? styles.active
                      : ""
                  }`}
                >
                  비밀번호 변경
                </NavLink>
                <NavLink
                  to="/corpmypage/withdraw"
                  className={`${styles.subNavItem} ${
                    location.pathname === "/corpmypage/withdraw"
                      ? styles.active
                      : ""
                  }`}
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

export default CorpSideBar;
