import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore"; // zustand 호출

const HeaderNav = () => {
  const { memType } = useAuthStore(); // memType: 0(개인), 1(기업)
  const isCorp = memType === 1;

  return (
    <div className="header-nav">
      <nav className="nav">
        {/* 개인 */}
        {!isCorp && (
          <>
            <NavLink
              to="/recruit"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              채용공고
            </NavLink>
            <NavLink
              to="/company"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              기업정보
            </NavLink>
            <NavLink
              to="/board"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              취준진담
            </NavLink>
            <NavLink
              to="/cv"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              내 이력서
            </NavLink>
          </>
        )}

        {/* 기업 */}
        {isCorp && (
          <>
            <NavLink
              to="/corprecruit"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              채용공고
            </NavLink>
            <NavLink
              to="/corpcompany/detail"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              기업정보
            </NavLink>
            <NavLink
              to="/corpcvlist"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              이력서 목록
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default HeaderNav;
