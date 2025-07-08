import CorpSideBar from "../../components/myPage/CorpSideBar";
import "./CorpMyPage.css";
import { Outlet } from "react-router-dom";
import useLoginMember from "../../stores/loginMember";
import { useEffect } from "react";

const CorpMyPage = () => {
  const { loginMember, setLoginMember } = useLoginMember();

  useEffect(() => {
    setLoginMember();
  }, []);

  // 출력 결과
  return (
    <div className="corpmypage-container">
      <CorpSideBar />
      <div className="corpmypage-content">
        <Outlet context={{ loginMember, setLoginMember }} />
      </div>
    </div>
  );
};

export default CorpMyPage;
