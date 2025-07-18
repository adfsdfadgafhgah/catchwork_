import icon from "../../assets/icon.png";
import styles from "./Footer.module.css";

import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <NavLink
          to="/policyprivacy"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          개인정보처리방침
        </NavLink>
        <NavLink
          to="/termsofservice"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          이용약관
        </NavLink>
        <span>Copyright © CATCH. All rights reserved.</span>
        <Link to="/supportlist" >
          문의하기
        </Link>
        <Link to="/corpregister">기업제휴</Link>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerLogo}>
          <img src={icon} height="150px" alt="CATCH Logo" />
          <p className={styles.footerText}>
            당신의 커리어를 연결합니다, <b>Catch Work.</b>
            <br /> 채용공고, 기업정보, 이력서 관리까지 한 번에 해결하세요.{" "}
            <br /> <b>Catch Work</b>는 이력서 작성부터 채용공고 지원, 기업정보
            탐색까지 지원하는 취업 통합 플랫폼입니다. <br />
            누구나 쉽게 시작하고, 끝까지 함께하는 취업 여정을 <b>Catch Work</b>
            와 함께하세요.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
