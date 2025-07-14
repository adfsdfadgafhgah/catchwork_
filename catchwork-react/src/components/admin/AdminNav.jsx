import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./AdminNav.module.css";
import logo from "../../assets/logo.png";

const AdminNav = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logoSection}>
          <Link to="/">
            <img className={styles.logo} src={logo} alt="logo" />
          </Link>
      </div>
      <ul className={styles.menu}>
        <li>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? styles.active : ""}>
            메인
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/support" className={({ isActive }) => isActive ? styles.active : ""}>
            문의
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/report" className={({ isActive }) => isActive ? styles.active : ""}>
            신고
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/ban" className={({ isActive }) => isActive ? styles.active : ""}>
            정지
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/restore" className={({ isActive }) => isActive ? styles.active : ""}>
            복구
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
