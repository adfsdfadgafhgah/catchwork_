import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null); // 로그인 시 객체, 아니면 null
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim() !== '') {
                navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            }
        }
    };
    const navigate = useNavigate();
    
    return (
        <header className="header">
        <div className="header-top">
            <div className="logo">
                <Link to="/">
                    <img src={logo} height="50px"/>
                </Link>
            </div>
            {/* 기업은 검색 X / 개인은 로그인/회원가입 시 검색 link X */}
            <div className="search-box">
                <button onClick={handleSearch}>검색</button> {/* 머지하고 바꾸기 */}
                <input
                    type="text"
                    placeholder="진중한 취업이야기, 취준진담"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
            <div className="user-info">
            {user ? (
                <>
                    <span>{user.nickname} 님</span>
                    <button onClick={logout}>로그아웃</button>
                </>
            ) : (
                <>
                    <Link to="/signin">로그인</Link>
                    &nbsp;|&nbsp;
                    <Link to="/signup">회원가입</Link>
                </>
            )}
            </div>
        </div>
        <nav className="nav">
            <Link to="/recruit">채용공고</Link>
            <Link to="/company">기업정보</Link>
            <Link to="/board">취준진담</Link>
            <Link to="/cv">내 이력서</Link>
        </nav>
        </header>
    );
};

export default Header;
