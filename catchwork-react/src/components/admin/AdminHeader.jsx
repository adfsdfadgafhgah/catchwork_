import React from "react";

import { useAdminTitle, handleAdminLogout } from "../../hooks/admin/headerUtils";
import styles from "./AdminHeader.module.css";

const AdminHeader = () => {
  const title = useAdminTitle();
  const handleLogout = handleAdminLogout();

  return (
    <header className={styles["admin-header"]}>
      <div className={styles["admin-header-top"]}>
        <div className={styles["admin-title"]}>
          <h1 className={styles["admin-title-text"]}>
            {title}
          </h1>
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
