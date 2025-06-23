import "./SideBar.css";

const SideBar = () => {
  // 주소값
  const location = useLocation();

  // 열린 메뉴
  const [expandedMenu, setExpandedMenu] = useState({
    fav: false,
    myContents: false,
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
            className={`nav-item ${
              location.pathname === "/mypage/home" ||
              location.pathname === "/mypage"
                ? "active"
                : ""
            }`}
          >
            내정보
          </NavLink>

          <NavLink
            to="/mypage/myrecruit"
            className={`nav-item ${
              location.pathname === "/mypage/myrecruit" ? "active" : ""
            }`}
          >
            지원한 공고
          </NavLink>

          {/* 관심 목록 */}
          <div>
            <button
              onClick={() => toggleMenu("fav")}
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
            {expandedMenu.fav && (
              <div className="sub-nav">
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/favrecruit" ? "active" : ""
                  }`}
                >
                  관심 공고
                </button>
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/favcompany" ? "active" : ""
                  }`}
                >
                  관심 기업
                </button>
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/favboard" ? "active" : ""
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
                  expandedMenu.myContents ? "rotate-90" : ""
                }`}
              >
                chevron_right
              </i>
            </button>
            {expandedMenu.myContents && (
              <div className="sub-nav">
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/myboard" ? "active" : ""
                  }`}
                >
                  내가 쓴 게시글
                </button>
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/mycomment" ? "active" : ""
                  }`}
                >
                  내가 쓴 댓글
                </button>
              </div>
            )}
          </div>

          <button
            className={`nav-item ${
              location.pathname === "/mypage/membership" ? "active" : ""
            }`}
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
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/eitmyinfo" ? "active" : ""
                  }`}
                >
                  내 정보 변경
                </button>
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/changepw" ? "active" : ""
                  }`}
                >
                  비밀번호 변경
                </button>
                <button
                  className={`sub-nav-item ${
                    location.pathname === "/mypage/withdraw" ? "active" : ""
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
