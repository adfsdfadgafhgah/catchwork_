import React, { useEffect, useState } from "react";
import SideBar from "../../components/myPage/SideBar";
import "./MyPage.css";
import MyInfoPage from "./MyInfoPage";
import MyRecruitPage from "./MyRecruitPage";
import { Outlet, Route, Routes } from "react-router-dom";

const MyPage = () => {
  // 출력 결과
  return (
    <div className="mypage-container">
      <SideBar />
      <Outlet />
    </div>
  );
};

export default MyPage;
