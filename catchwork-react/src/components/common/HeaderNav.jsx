import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore"; // zustand 호출
import styles from "./Header.module.css";

const HeaderNav = ({
  isMobile = false,
  mobileMenuOpen,
  setMobileMenuOpen,
  memType,
  memNickname,
  memName,
  handleSignOut,
  navigate,
  searchTerm,
  setSearchTerm,
  handleSearch,
  isCorpUser,
}) => {
  // 모바일: userInfo, 검색창, nav 모두 포함
  if (isMobile) {
    return (
      <div className={styles.mobileMenuPanel}>
        {/* userInfo */}
        <div className={styles.userInfo}>
          {memType !== null ? (
            <>
              {memType === 1 ? (
                <button onClick={() => navigate("/corpmypage")}>
                  {memName} 님
                </button>
              ) : (
                <button onClick={() => navigate("/mypage")}>
                  {memNickname} 님
                </button>
              )}
              <button onClick={handleSignOut}>로그아웃</button>
            </>
          ) : (
            <>
              <NavLink to="/signin" onClick={() => setMobileMenuOpen(false)}>
                로그인
              </NavLink>
              <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                회원가입
              </NavLink>
            </>
          )}
        </div>
        {/* 검색창 */}
        {!isCorpUser && (
          <div className={styles.searchBox}>
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            ></i>
            <input
              type="text"
              placeholder="진중한 취업이야기, 취준진담"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        )}
        {/* nav */}
        <div className={styles.headerNav}>
          <nav className={styles.nav}>
            {/* 개인 */}
            {memType !== 1 && (
              <>
                <NavLink
                  to="/memberrecruit"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  채용공고
                </NavLink>
                <NavLink
                  to="/company"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  기업정보
                </NavLink>
                <NavLink
                  to="/board"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  취준진담
                </NavLink>
                <NavLink
                  to="/cv"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  내 이력서
                </NavLink>
              </>
            )}
            {/* 기업 */}
            {memType === 1 && (
              <>
                <NavLink
                  to="/corprecruit"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  채용공고
                </NavLink>
                <NavLink
                  to="/corpcompany/detail"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  기업정보
                </NavLink>
                <NavLink
                  to="/corpcvlist"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.active}`
                      : styles.navLink
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  이력서 목록
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    );
  }

  // 데스크탑: 기존 nav만 렌더링
  return (
    <div
      className={
        styles.headerNav +
        " " +
        (mobileMenuOpen ? styles.navOpen : styles.navClosed)
      }
    >
      <nav className={styles.nav}>
        {/* 개인 */}
        {useAuthStore.getState().memType !== 1 && (
          <>
            <NavLink
              to="/memberrecruit"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              채용공고
            </NavLink>
            <NavLink
              to="/company"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              기업정보
            </NavLink>
            <NavLink
              to="/board"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              취준진담
            </NavLink>
            <NavLink
              to="/cv"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              내 이력서
            </NavLink>
          </>
        )}
        {/* 기업 */}
        {useAuthStore.getState().memType === 1 && (
          <>
            <NavLink
              to="/corprecruit"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              채용공고
            </NavLink>
            <NavLink
              to="/corpcompany/detail"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              기업정보
            </NavLink>
            <NavLink
              to="/corpcvlist"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
              onClick={() => setMobileMenuOpen(false)}
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
