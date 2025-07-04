import SideBar from "../../components/myPage/SideBar";
import "./MyPage.css";
import { Outlet } from "react-router-dom";
import useLoginMember from "../../stores/loginMember";
import { useEffect } from "react";

const MyPage = () => {
  const { loginMember, setLoginMember } = useLoginMember();

  useEffect(() => {
    setLoginMember();
  }, []);

  // 출력 결과
  return (
    <div className="mypage-container">
      <SideBar />
      <div className="mypage-content">
        <Outlet context={{ loginMember, setLoginMember }} />
      </div>
    </div>
  );
};

export default MyPage;
