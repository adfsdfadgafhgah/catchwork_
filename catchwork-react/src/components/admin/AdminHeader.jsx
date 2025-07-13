import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./AdminHeader.module.css";

const AdminHeader = () => {

  const handle = () => {
    navigate("/");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-top">
        {/* 로고 */}
        <div className="admin-logo">
          <Link to="/admin">
            캐치워크
          </Link>
        </div>
        <div className="amin-info">
          <p className="admin-name">관리자</p>
          <button className="admin-logout">로그아웃</button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
