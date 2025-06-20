import React, { useEffect, useState } from "react";
import "./SideBar.css";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const [activeTab, setActiveTab] = useState("myinfo");

  useEffect(() => {
    setActiveTab();
  }, [activeTab]);

  // 열린 메뉴
  const [expandedMenu, setExpandedMenu] = useState({
    interest: false,
    myPosts: false,
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
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">마이 페이지</h2>

        <nav className="sidebar-nav">
          <NavLink
            to="/mypage/home"
            onClick={() => setActiveTab("myinfo")}
            className={`nav-item ${activeTab === "myinfo" ? "active" : ""}`}
          >
            내정보
          </NavLink>

          <NavLink
            to="/mypage/myrecruit"
            onClick={() => setActiveTab("myrecruit")}
            className={`nav-item ${activeTab === "myrecruit" ? "active" : ""}`}
          >
            지원한 공고
          </NavLink>

          {/* 관심 목록 */}
          <div>
            <button
              onClick={() => toggleMenu("interest")}
              className="nav-item nav-item-expandable"
            >
              <span>관심 목록</span>
              <i
                className={`material-icons ${
                  expandedMenu.interest ? "rotate-90" : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.interest && (
              <div className="sub-nav">
                <button
                  onClick={() => setActiveTab("관심공고")}
                  className={`sub-nav-item ${
                    activeTab === "관심공고" ? "active" : ""
                  }`}
                >
                  관심 공고
                </button>
                <button
                  onClick={() => setActiveTab("관심기업")}
                  className={`sub-nav-item ${
                    activeTab === "관심기업" ? "active" : ""
                  }`}
                >
                  관심 기업
                </button>
                <button
                  onClick={() => setActiveTab("관심후기")}
                  className={`sub-nav-item ${
                    activeTab === "관심후기" ? "active" : ""
                  }`}
                >
                  관심 후기
                </button>
              </div>
            )}
          </div>

          {/* 내가 쓴 목록 */}
          <div>
            <button
              onClick={() => toggleMenu("myPosts")}
              className="nav-item nav-item-expandable"
            >
              <span>내가 쓴 목록</span>
              <i
                className={`material-icons ${
                  expandedMenu.myPosts ? "rotate-90" : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.myPosts && (
              <div className="sub-nav">
                <button
                  onClick={() => setActiveTab("내가쓴게시글")}
                  className={`sub-nav-item ${
                    activeTab === "내가쓴게시글" ? "active" : ""
                  }`}
                >
                  내가 쓴 게시글
                </button>
                <button
                  onClick={() => setActiveTab("내가쓴댓글")}
                  className={`sub-nav-item ${
                    activeTab === "내가쓴댓글" ? "active" : ""
                  }`}
                >
                  내가 쓴 댓글
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab("멤버쉽")}
            className={`nav-item ${activeTab === "멤버쉽" ? "active" : ""}`}
          >
            멤버쉽
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
