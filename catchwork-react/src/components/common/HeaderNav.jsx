import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

const HeaderNav = () => {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="header-nav">
      <nav className="nav">
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

        {/* 기업 회원 조건 넣기전에 NAV에서 7개 다 보여주려고  */}
        <NavLink
          to="/corprecruit"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          채용공고
        </NavLink>
        <NavLink
          to="/corpcompanydetail"
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
      </nav>
    </div>
  );
};

export default HeaderNav;
