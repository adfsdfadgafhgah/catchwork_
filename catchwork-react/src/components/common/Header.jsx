import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HeaderNav from './HeaderNav'

const Header = () => {
    // 로그인 시 객체, 아니면 null
    const [user, setUser] = useState(null); 
    // 검색어
    const [searchTerm, setSearchTerm] = useState('');

    // 페이지 확인용 코드
    const location = useLocation();
    const path = location.pathname;
    const isAuthPage = path === '/signin' || path === '/signup';


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
                {/* 로그인/회원가입 페이지 or 기업일 경우 안 보이게 처리 */}
                {!isAuthPage && /* 여기에 기업인지 아닌지 확인하는 코드 들어올 예정 ㅇㅇ */(
                <div className="search-box">
                    <button onClick={handleSearch}>검색</button> {/* 머지하고 돋보기로 바꾸기 */}
                    <input
                        type="text"
                        placeholder="진중한 취업이야기, 취준진담"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>)}

                {/* 무슨영역이라고 주석달지 모르겠음 */}
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
            {/* 로그인/회원가입 페이지일 때는 안 보이게 처리리 */}
            {!isAuthPage && <HeaderNav />}
        </header>
    );
};

export default Header;
