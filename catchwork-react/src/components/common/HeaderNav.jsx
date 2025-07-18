import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore"; // zustand 호출
import styles from "./Header.module.css";

const HeaderNav = () => {
  const { memType } = useAuthStore(); // memType: 0(개인), 1(기업)
  const isCorp = memType === 1;

  return (
    <div className={styles.headerNav}>
      <nav className={styles.nav}>
        {/* 개인 */}
        {!isCorp && (
          <>
            <NavLink
              to="/memberrecruit"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              채용공고
            </NavLink>
            <NavLink
              to="/company"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              기업정보
            </NavLink>
            <NavLink
              to="/board"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              취준진담
            </NavLink>
            <NavLink
              to="/cv"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
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
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              채용공고
            </NavLink>
            <NavLink
              to="/corpcompany/detail"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              기업정보
            </NavLink>
            <NavLink
              to="/corpcvlist"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
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
