import React, { useState } from "react";
import "./CorpSideBar.css";
import { NavLink, useLocation } from "react-router-dom";

const CorpSideBar = () => {
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
    <div className="corpsidebar">
      <div className="corpsidebar-content">
        <h2 className="corpsidebar-title">마이 페이지</h2>

        <nav className="corpsidebar-nav">
          <NavLink
            to="/corpmypage/home"
            className={`nav-item ${
              location.pathname === "/corpmypage/home" ||
              location.pathname === "/corpmypage"
                ? "active"
                : ""
            }`}
          >
            내정보
          </NavLink>

          {/* 계정 관리 */}
          <div>
            <button
              onClick={() => toggleMenu("account")}
              className="nav-item nav-item-expandable"
            >
              <span>계정관리</span>
              <i
                className={`material-icons ${
                  expandedMenu.account ? "rotate-90" : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.account && (
              <div className="sub-nav">
                <NavLink
                  className={`sub-nav-item ${
                    location.pathname === "/corpmypage/eitmyinfo" ? "active" : ""
                  }`}
                  to="/corpmypage/editmyinfo"
                >
                  내 정보 변경
                </NavLink>
                <NavLink
                  className={`sub-nav-item ${
                    location.pathname === "/corpmypage/changepw" ? "active" : ""
                  }`}
                  to="/corpmypage/changepw"
                >
                  비밀번호 변경
                </NavLink>
                <NavLink
                  className={`sub-nav-item ${
                    location.pathname === "/corpmypage/withdraw" ? "active" : ""
                  }`}
                  to="/corpmypage/withdraw"
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
