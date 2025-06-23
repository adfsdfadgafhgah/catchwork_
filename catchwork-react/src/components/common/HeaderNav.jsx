import React from "react";
import { NavLink } from "react-router-dom";

/* 
기존에 location으로 주소 확인해서 active 넣던 그런 귀찮은 짓을 
그냥 activeClassName 쓰면 한 줄로 가능함...
이거 왜 아무도 안 알려줌?
*/

const HeaderNav = () => {
  return (
    <div className="header-nav">
      <nav className="nav">
        <NavLink to="/recruit" activeClassName="active">
          채용공고
        </NavLink>
        <NavLink to="/company" activeClassName="active">
          기업정보
        </NavLink>
        <NavLink to="/board" activeClassName="active">
          취준진담
        </NavLink>
        <NavLink to="/cv" activeClassName="active">
          내 이력서
        </NavLink>
      </nav>
    </div>
  );
};

export default HeaderNav;
