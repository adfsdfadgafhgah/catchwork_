import React from "react";

import { useAdminTitle, handleAdminLogout } from "../../hooks/admin/headerUtils";
import styles from "./AdminHeader.module.css";
import useAdminInfo from "../../hooks/admin/useAdminInfo";

const AdminHeader = () => {
  const title = useAdminTitle();
  const handleLogout = handleAdminLogout();
  const { adminInfo, loading } = useAdminInfo();

  return (
    <header className={styles["admin-header"]}>
      <div className={styles["admin-header-top"]}>
        <div className={styles["admin-title"]}>
          <h1 className={styles["admin-title-text"]}>
            {title}
          </h1>
        </div>
        <div className={styles["admin-info"]}>
          <p className={styles["admin-name"]}>
            {loading ? "(◕ᴗ̵◕)" : adminInfo?.adminNickname || "관리자"}
          </p>
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
