import SideBar from "../../components/myPage/SideBar";
import "./MyPage.css";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const MyPage = () => {
  const { memNo } = useAuthStore();

  // 출력 결과
  return (
    <div className="mypage-container">
      <SideBar />
      <div className="mypage-content">
        <Outlet context={{ memNo }} />
      </div>
    </div>
  );
};

export default MyPage;
