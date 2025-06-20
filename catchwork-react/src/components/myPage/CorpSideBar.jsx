import React, { useState } from "react";
import "./SideBar.css";

const SideBar = ({ activeTab, setActiveTab }) => {
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

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">마이 페이지</h2>

        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("내정보")}
            className={`nav-item ${activeTab === "내정보" ? "active" : ""}`}
          >
            내정보
          </button>          

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
                <button
                  onClick={() => setActiveTab("내정보변경")}
                  className={`sub-nav-item ${
                    activeTab === "내정보변경" ? "active" : ""
                  }`}
                >
                  내 정보 변경
                </button>
                <button
                  onClick={() => setActiveTab("비밀번호변경")}
                  className={`sub-nav-item ${
                    activeTab === "비밀번호변경" ? "active" : ""
                  }`}
                >
                  비밀번호 변경
                </button>
                <button
                  onClick={() => setActiveTab("회원탈퇴")}
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

export default SideBar;
