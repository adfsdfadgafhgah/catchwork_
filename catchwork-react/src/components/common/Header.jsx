import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <img src="/logo.png" alt="CatchWork Logo" />
          <span>Catch Work</span>
        </div>
        <div className="search-box">
          <input type="text" placeholder="진중한 취업이야기, 취준진담" />
        </div>
        <div className="user-info">
          <span>오후쿠꾸꾸쿠후오오후 님</span>
          <button>로그아웃</button>
        </div>
      </div>
      <nav className="nav">
        <a href="#">채용공고</a>
        <a href="#">기업정보</a>
        <a href="#">취준진담</a>
        <a href="#">내 이력서</a>
      </nav>
    </header>
  );
};

export default Header;
