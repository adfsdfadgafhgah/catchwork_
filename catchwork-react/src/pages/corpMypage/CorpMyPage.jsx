import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import useLoginMember from "../../stores/loginMember";
import "./CorpMyPage.css";

const CorpMyPage = () => {
  const { loginMember, setLoginMember } = useLoginMember();

  useEffect(() => {
    setLoginMember();
  }, []);

  return (
    <div className="corp-page-container">
      <CorpSideBar />
      <div className="corp-edit-content">
        <Outlet context={{ loginMember, setLoginMember }} />
      </div>
    </div>
  );
};

export default CorpMyPage;
