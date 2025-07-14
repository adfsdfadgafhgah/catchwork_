import React from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./AdminHeader.module.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className={styles["admin-header"]}>
      <div className={styles["admin-header-top"]}>
        {/* 로고 */}
        <div className={styles["admin-logo"]}>
          <Link to="/admin" className={styles["admin-logo-text"]}>
            캐치워크
          </Link>
        </div>
        <div className={styles["admin-info"]}>
          <p className={styles["admin-name"]}>관리자</p>
          <button
            className={styles["admin-logout"]}
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
