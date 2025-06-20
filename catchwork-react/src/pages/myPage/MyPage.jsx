import SideBar from "../../components/myPage/SideBar";
import "./MyPage.css";
import { Outlet, Route, Routes } from "react-router-dom";

const MyPage = () => {
  // 출력 결과
  return (
    <div className="mypage-container">
      <SideBar />
      <div className="mypage-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPage;
