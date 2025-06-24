import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CorpSideBar.css";

const CorpSideBar = ({ activeTab, setActiveTab = () => {} }) => { // 기본값 설정
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState({
    interest: false,
    myPosts: false,
    account: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleNavigation = (tab, path) => {
    if (location.pathname !== path) {
      setActiveTab(tab);
      navigate(path);
    } else {
      setActiveTab(tab); // 동일 경로일 경우 탭만 업데이트
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">마이 페이지</h2>
        <nav className="sidebar-nav">
          <button
            onClick={() => handleNavigation("내정보", "/corpmypage")}
            className={`nav-item ${activeTab === "내정보" ? "active" : ""}`}
          >
            내정보
          </button>
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
                <button
                  onClick={() => handleNavigation("내정보변경", "/corpconfirmedit")}
                  className={`sub-nav-item ${
                    activeTab === "내정보변경" ? "active" : ""
                  }`}
                >
                  내 정보 변경
                </button>
                <button
                  onClick={() => handleNavigation("비밀번호변경", "/corpchangepw")}
                  className={`sub-nav-item ${
                    activeTab === "비밀번호변경" ? "active" : ""
                  }`}
                >
                  비밀번호 변경
                </button>
                <button
                  onClick={() => handleNavigation("회원탈퇴", "/corpwithdraw")}
                  className={`sub-nav-item ${
                    activeTab === "회원탈퇴" ? "active" : ""
                  }`}
                >
                  회원 탈퇴
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default CorpSideBar;