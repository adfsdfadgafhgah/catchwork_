import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeaderNav = () => {
    const navigate = useNavigate();
  return (
    <div className="header-nav">
        <nav className="nav">
        <Link to="/recruit">채용공고</Link>
        <Link to="/company">기업정보</Link>
        <Link to="/board">취준진담</Link>
        <Link to="/cv">내 이력서</Link>
        </nav>
    </div>
  );
};

export default HeaderNav;

